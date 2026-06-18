// Marken-Coach — Cloudflare Worker (Proxy zur Anthropic-API).
//
// Hält den API-Key geheim, prüft Origin, rate-limitet, baut den System-Prompt
// mit der gecachten Marken-Wissensbasis und streamt Claudes Antwort als SSE
// (nur Text-Deltas) an den Browser zurück.

import {
  KNOWLEDGE_URL,
  FALLBACK_KNOWLEDGE,
  buildStableSystem,
  buildAbteilungContext,
} from './knowledge.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const DEFAULT_ORIGINS = [
  'https://marke.verkehrskadetten.ch',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

const MAX_MESSAGES = 20;        // Verlaufslänge (Sicherheits-/Kostenlimit)
const MAX_MESSAGE_CHARS = 4000; // pro Nachricht
const MAX_TOKENS = 1024;        // Antwortlänge

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = allowedOrigins(env);
    const isAllowed = allowed.includes(origin);
    const cors = corsHeaders(isAllowed ? origin : '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }
    if (!isAllowed) {
      return json({ error: 'Origin nicht erlaubt' }, 403, cors);
    }

    // Rate-Limit pro IP (Binding ist optional — fehlt es, wird übersprungen).
    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return json(
          { error: 'Zu viele Anfragen. Bitte einen Moment warten.' },
          429,
          cors,
        );
      }
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Ungültiges JSON' }, 400, cors);
    }

    const messages = sanitizeMessages(body && body.messages);
    if (!messages) {
      return json({ error: 'Feld "messages" fehlt oder ist ungültig' }, 400, cors);
    }
    const abteilung = typeof body.abteilung === 'string' ? body.abteilung : null;

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Server nicht konfiguriert (API-Key fehlt)' }, 500, cors);
    }

    const knowledge = await getKnowledge();
    const payload = {
      model: env.MODEL || 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS,
      stream: true,
      thinking: { type: 'disabled' },
      system: [
        {
          type: 'text',
          text: buildStableSystem(knowledge),
          cache_control: { type: 'ephemeral' }, // gecachter Prefix
        },
        {
          type: 'text',
          text: buildAbteilungContext(abteilung), // volatil, nicht gecacht
        },
      ],
      messages,
    };

    let upstream;
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      return json({ error: 'Verbindung zur KI fehlgeschlagen' }, 502, cors);
    }

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '');
      console.error('Anthropic error', upstream.status, detail);
      return json({ error: 'KI-Anfrage fehlgeschlagen' }, 502, cors);
    }

    // Claude-SSE → schlanker Text-Stream für den Browser.
    const stream = upstream.body.pipeThrough(claudeToTextStream());
    return new Response(stream, {
      headers: {
        ...cors,
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
      },
    });
  },
};

// ── Helpers ──

function allowedOrigins(env) {
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  }
  return DEFAULT_ORIGINS;
}

function corsHeaders(origin) {
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (origin) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'content-type': 'application/json; charset=utf-8' },
  });
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const trimmed = raw.slice(-MAX_MESSAGES);
  const out = [];
  for (const m of trimmed) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
    if (typeof m.content !== 'string' || !m.content.trim()) return null;
    out.push({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) });
  }
  // API verlangt: erste Nachricht muss "user" sein.
  if (out[0].role !== 'user') return null;
  return out;
}

// Wissensbasis laden & im Edge-Cache halten (Single Source of Truth).
async function getKnowledge() {
  try {
    const res = await fetch(KNOWLEDGE_URL, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) return text;
    }
  } catch {
    /* fällt auf FALLBACK_KNOWLEDGE zurück */
  }
  return FALLBACK_KNOWLEDGE;
}

/**
 * TransformStream: parst Anthropics SSE und gibt nur die Text-Deltas weiter.
 * Protokoll an den Client (jeweils eine SSE-Zeile):
 *   data: {"t":"<chunk>"}     — Text-Stück
 *   data: {"done":true}       — fertig
 *   data: {"error":"..."}     — Fehler
 */
function claudeToTextStream() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const send = (controller, obj) =>
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // letzte (evtl. unvollständige) Zeile behalten

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data || data === '[DONE]') continue;

        let evt;
        try {
          evt = JSON.parse(data);
        } catch {
          continue;
        }

        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
          send(controller, { t: evt.delta.text });
        } else if (evt.type === 'message_stop') {
          send(controller, { done: true });
        } else if (evt.type === 'error') {
          send(controller, { error: evt.error?.message || 'Unbekannter Fehler' });
        }
      }
    },
    flush(controller) {
      send(controller, { done: true });
    },
  });
}
