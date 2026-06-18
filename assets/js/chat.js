// Marken-Coach — Chat-Widget (Frontend).
// Spricht den Cloudflare Worker an, der den Anthropic-API-Key hält.

// ── Konfiguration ──
// Nach dem Deploy hier die echte Worker-URL eintragen (npx wrangler deploy gibt sie aus).
const WORKER_URL_PROD = 'https://marke-coach.mark-eichmann.workers.dev/';
// Lokal (python http.server auf :8080) zeigt das Widget auf `wrangler dev` (:8787).
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const WORKER_URL = isLocal ? 'http://localhost:8787/' : WORKER_URL_PROD;

(function initChat() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const log = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  if (!fab || !panel || !log || !form || !input) return;

  const history = []; // [{ role:'user'|'assistant', content }]
  let busy = false;
  let greeted = false;

  function getCookie(name) {
    const m = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
    return m ? decodeURIComponent(m.trim().slice(name.length + 1)) : null;
  }

  // ── Panel öffnen/schliessen ──
  function open() {
    panel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) { greet(); greeted = true; }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }
  fab.addEventListener('click', () => (panel.classList.contains('open') ? close() : open()));
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });

  // ── Begrüssung + Vorschläge ──
  function greet() {
    addBubble('bot',
      'Hallo! Ich bin der Marken-Coach. Ich helfe dir, das Erscheinungsbild der Verkehrskadetten für deine Abteilung umzusetzen — Farben, Logos, Texte, Checklisten.');
    const chips = [
      'Welche Farben und Schrift sind korrekt?',
      'Schreib mir einen Instagram-Post für meine Abteilung',
      'Checkliste: Logo richtig einsetzen',
      'Welche Logo-Dateien gibt es für meine Abteilung?',
    ];
    const wrap = document.createElement('div');
    wrap.className = 'chat-chips';
    chips.forEach(text => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-chip';
      b.textContent = text;
      b.addEventListener('click', () => { if (!busy) submit(text); });
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
    scroll();
  }

  // ── Nachrichten rendern ──
  function addBubble(kind, text) {
    const el = document.createElement('div');
    el.className = `chat-msg chat-msg-${kind}`;
    el.innerHTML = format(text);
    log.appendChild(el);
    scroll();
    return el;
  }
  function scroll() { log.scrollTop = log.scrollHeight; }

  // Sehr leichtes Markdown: HTML escapen, **fett**, Zeilenumbrüche.
  function format(text) {
    const esc = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  // ── Senden ──
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text && !busy) submit(text);
  });

  async function submit(text) {
    busy = true;
    input.value = '';
    setDisabled(true);
    // Vorschlags-Chips nach erster Nutzung entfernen.
    const chips = log.querySelector('.chat-chips');
    if (chips) chips.remove();

    addBubble('user', text);
    history.push({ role: 'user', content: text });

    const botEl = addBubble('bot', '');
    botEl.classList.add('chat-typing');
    botEl.innerHTML = '<span class="chat-dots"><span></span><span></span><span></span></span>';

    let answer = '';
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, abteilung: getCookie('abteilung') || null }),
      });

      if (!res.ok || !res.body) {
        const msg = res.status === 429
          ? 'Zu viele Anfragen — bitte einen Moment warten.'
          : 'Es gab ein Problem mit der Anfrage. Bitte später erneut versuchen.';
        fail(botEl, msg);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let first = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop();
        for (const part of parts) {
          const line = part.split('\n').find(l => l.startsWith('data:'));
          if (!line) continue;
          let evt;
          try { evt = JSON.parse(line.slice(5).trim()); } catch { continue; }
          if (evt.error) { fail(botEl, 'Fehler: ' + evt.error); return; }
          if (evt.done) continue;
          if (typeof evt.t === 'string') {
            if (first) { botEl.classList.remove('chat-typing'); botEl.innerHTML = ''; first = false; }
            answer += evt.t;
            botEl.innerHTML = format(answer);
            scroll();
          }
        }
      }

      if (!answer) { fail(botEl, 'Keine Antwort erhalten.'); return; }
      history.push({ role: 'assistant', content: answer });
    } catch {
      fail(botEl, 'Keine Verbindung. Bitte Internetverbindung prüfen.');
      return;
    } finally {
      busy = false;
      setDisabled(false);
      input.focus();
    }
  }

  function fail(botEl, msg) {
    botEl.classList.remove('chat-typing');
    botEl.classList.add('chat-msg-error');
    botEl.textContent = msg;
    scroll();
  }

  function setDisabled(state) {
    input.disabled = state;
    if (sendBtn) sendBtn.disabled = state;
  }
})();
