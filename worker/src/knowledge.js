// Wissensbasis & System-Prompt für den Marken-Coach.
//
// Die eigentliche Marken-Doku wird zur Laufzeit von der Live-Seite geladen
// (downloads/design-system.md) und gecacht — so bleibt sie Single Source of
// Truth und muss bei Design-Änderungen nicht im Worker nachgepflegt werden.
// FALLBACK_KNOWLEDGE greift nur, falls der Abruf scheitert.

export const KNOWLEDGE_URL =
  'https://marke.verkehrskadetten.ch/downloads/design-system.md';

// Abteilung-ID → Anzeigename (deckungsgleich mit assets/js/main.js).
export const ABTEILUNGEN = {
  'albis': 'VK Albis',
  'ausserschwyz': 'VK Ausserschwyz',
  'basel': 'VK Kadetten Korps Basel',
  'bern': 'VK Bern',
  'chur': 'VK Chur',
  'fuerstenland': 'VK Fürstenland',
  'glarnerland': 'VK Glarnerland',
  'luzern': 'VK Luzern',
  'nordwest-schweiz': 'VK Nordwest Schweiz',
  'rapperswil-jona': 'VK Rapperswil-Jona',
  'saanenland': 'VK Saanenland',
  'samstagern-richterswil': 'VK Samstagern-Richterswil',
  'schaffhausen': 'VK Schaffhausen',
  'st-gallen': 'VK St. Gallen',
  'st-galler-oberland': 'VK St. Galler Oberland',
  'thurgau': 'VK Thurgau',
  'winterthur': 'VK Winterthur',
  'zuerich-oberland': 'VK Zürcher Oberland',
  'zuerich-unterland': 'VK Zürcher Unterland',
  'zuerichsee': 'VK Zürichsee',
  'zug': 'VK Zug',
};

// Kompakter Fallback, falls die Live-MD nicht erreichbar ist.
export const FALLBACK_KNOWLEDGE = [
  'Namen: Die Marke heisst «Verkehrskadetten». Trägerorganisation ist der «Schweizerische Verkehrskadetten Verband» (kurz SVKV) — dieser Name gehört nur in rechtliche Kontexte (Copyright, Impressum, Verträge), nie in die Markenkommunikation. «Verkehrskadetten Schweiz» ist die Absender-Schreibweise der Wortmarke im Kollaborations-Fall, kein eigener Markenname.',
  'Claim: «Jugend bewegt Verkehr». Identität: WAS — Verkehr und Zugänge bei Veranstaltungen sichern, verlässlich, wirksam, ehrenamtlich. WIE — mit geschulten Jugendlichen, klarem Ablauf, menschlichem Auftreten, regional verankert. WARUM — weil gesellschaftliches Miteinander sichere Mobilität und Verantwortung braucht.',
  'Farben: Primärfarbe VK Orange #FF6300 (CMYK 0/75/100/0, Pantone 1585), Sekundärfarbe VK Blau #2F5D77 (CMYK 86/57/37/15, Pantone 7699), Weiss #FFFFFF, Schwarz #000000. Keine Verläufe.',
  'Farbregeln: Primärfarbe vor allem für das «V» der Bildmarke und als Hintergrund, Sekundärfarbe ausschliesslich als Hintergrund. Text jeder Art nie in Primär- oder Sekundärfarbe — nur Schwarz oder Weiss.',
  'Schrift: Inter (Hausschrift, SIL OFL) — Bold (700) für Titel/Slogans, Regular (400) für Fliesstext, Light (300) für Claim/Fliesstext, Italic punktuell. Office-Ersatz: Calibri. Fakt bleibt ausschliesslich Logo und Wortmarke vorbehalten.',
  'Tonalität: «Reduce to the max» — kurze, präzise, aktive Sätze. Immer «Uniform», nie «Weste».',
  'Logo: besteht aus Bildmarke, Wortmarke und deren Kombination. Nur freigegebene SVG/PDF verwenden, Schutzraum einhalten, nicht verzerren/umfärben/mit Effekten versehen. Minimalgrösse richtet sich nach der Leserlichkeit der Wortmarke.',
  'Markenarchitektur: drei Auftrittsformen — Familie (Abteilung übernimmt Logo und Design der Dachmarke, Regionalname integriert), Endorsed (eigenes Logo, Designsystem der Dachmarke, nationales Logo als Absender), Kollaboration (eigenständiger Auftritt, punktuell ergänzt durch die Wortmarke «Verkehrskadetten Schweiz»).',
  'Abteilungslogos: assets/logos/abteilungen/{id}_{RGB|CMYK}_{schwarz|weiss}.svg; ZIP: downloads/logos-abteilungen/{id}.zip.',
  'Bildsprache: authentische Fotografie echter Einsätze, von vorne, nah an der Person, Hintergrund unscharf, Gesichter und Emotionen. Keine Aufnahmen von hinten, keine angeschnittenen Köpfe, keine unscharfen Fotos.',
  'Rechte: Nutzungsrechte liegen vollständig bei den Verkehrskadetten; die Urheberrechte verbleiben bei LOOKINGLATELY | Heimspiel. Designs dürfen nur mit vorheriger Zustimmung verändert oder von Dritten bearbeitet werden.',
].join('\n');

const ROLE = `Du bist der «Marken-Coach» der Verkehrskadetten — ein hilfreicher Assistent im Markenportal (marke.verkehrskadetten.ch).

Deine Aufgabe: Du hilfst den einzelnen Abteilungen, das Corporate Identity / Corporate Design (CI/CD) der Dachmarke «Verkehrskadetten» konkret für ihre eigene Abteilung umzusetzen. Du kannst:
1. MARKENFRAGEN beantworten — Farben, Logos, Schrift, Tonalität, Bildsprache.
2. TEXTE & MATERIAL erstellen — z. B. Social-Media-Posts, Plakat- oder Flyer-Texte, E-Mail-Signaturen, Aushänge — immer im richtigen Markenton.
3. UMSETZUNGS-CHECKLISTEN liefern — Schritt für Schritt, was die Abteilung tun/herunterladen/beachten muss.
4. ASSET-LOTSE sein — auf die richtigen Downloads und Logo-Dateien der jeweiligen Abteilung verweisen.`;

const RULES = `Verhaltensregeln:
- Antworte immer auf Deutsch (Schweizer Hochdeutsch, kein «ß» — verwende «ss»).
- Halte dich strikt an die Markenrichtlinien oben. Erfinde keine Farben, Schriften, Logos oder Regeln.
- Schreibe selbst im Markenton: klar, direkt, professionell, «Reduce to the max». Kurze Sätze.
- Sage immer «Uniform», nie «Weste».
- Wenn du auf Dateien verweist, nutze die echten Pfade aus den Richtlinien (z. B. Abteilungslogos: assets/logos/abteilungen/{id}_RGB_schwarz.svg; ZIP der Abteilung: downloads/logos-abteilungen/{id}.zip; Marken-Manual: downloads/Verkehrskadetten_Marken-Manual.pdf).
- Wenn du etwas nicht aus den Richtlinien weisst, sag das offen und verweise auf marke@verkehrskadetten.ch — rate nicht.
- Halte Antworten kompakt. Nutze kurze Absätze oder Aufzählungen. Kein Marketingsprech.`;

/**
 * Baut den stabilen (cachebaren) System-Block: Rolle + Wissensbasis + Regeln.
 * Muss über Requests bytegleich bleiben, damit Prompt-Caching greift —
 * daher nur konstante Teile plus die (identisch gecachte) Wissensbasis.
 */
export function buildStableSystem(knowledge) {
  return `${ROLE}

═══════════════ MARKENRICHTLINIEN (verbindliche Wissensbasis) ═══════════════

${knowledge}

═════════════════════════════════════════════════════════════════════════════

${RULES}`;
}

/**
 * Volatiler Kontext zur aktuell gewählten Abteilung (nicht gecacht).
 */
export function buildAbteilungContext(abteilung) {
  const name = abteilung && ABTEILUNGEN[abteilung];
  if (!name) {
    return 'Kontext: Es ist aktuell keine Abteilung gewählt (Dachmarke-Ansicht). Wenn die Frage abteilungsspezifisch ist, bitte den Nutzer, oben im Header seine Abteilung zu wählen.';
  }
  return `Kontext: Der Nutzer gehört zur Abteilung «${name}» (ID: ${abteilung}).
Verfügbare Logo-Dateien dieser Abteilung:
- assets/logos/abteilungen/${abteilung}_RGB_schwarz.svg (für helle Hintergründe)
- assets/logos/abteilungen/${abteilung}_RGB_weiss.svg (für dunkle Hintergründe)
- assets/logos/abteilungen/${abteilung}_CMYK_schwarz.svg / _CMYK_weiss.svg (für Druck)
- downloads/abteilungen/social/${abteilung}.png (Social-Media-Vorschau)
- downloads/logos-abteilungen/${abteilung}.zip (komplettes Logo-Paket)
Beziehe dich, wo sinnvoll, konkret auf «${name}» und diese Dateien.`;
}
