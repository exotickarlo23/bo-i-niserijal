/**
 * Datumi i otključavanje.
 * Sve se računa po vremenskoj zoni Europe/Zagreb: vratašca se otvaraju u ponoć po hrvatskom vremenu.
 */

export const VREMENSKA_ZONA = 'Europe/Zagreb';

const MJESECI = [
  'siječnja',
  'veljače',
  'ožujka',
  'travnja',
  'svibnja',
  'lipnja',
  'srpnja',
  'kolovoza',
  'rujna',
  'listopada',
  'studenoga',
  'prosinca',
];

/** Današnji datum u Zagrebu kao "GGGG-MM-DD". Za testiranje se može zadati varijablom okruženja DANAS. */
export function danasUZagrebu(sada: Date = new Date()): string {
  const zadano = typeof process !== 'undefined' ? process.env.DANAS : undefined;
  if (zadano && /^\d{4}-\d{2}-\d{2}$/.test(zadano)) return zadano;

  const dijelovi: Record<string, string> = {};
  for (const d of new Intl.DateTimeFormat('en-GB', {
    timeZone: VREMENSKA_ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(sada)) {
    dijelovi[d.type] = d.value;
  }
  return `${dijelovi.year}-${dijelovi.month}-${dijelovi.day}`;
}

/** Je li datum (GGGG-MM-DD) već stigao po zagrebačkom vremenu. */
export function jeObjavljeno(datum: string, danas: string = danasUZagrebu()): boolean {
  return datum <= danas;
}

/** "2026-12-08" → 8 */
export function danUMjesecu(datum: string): number {
  return Number(datum.slice(8, 10));
}

/** "2026-12-08" → "8. prosinca" (ili "8. prosinca 2026." uz sGodinom). */
export function formatirajDatum(datum: string, sGodinom = false): string {
  const [g, m, d] = datum.split('-').map(Number);
  const osnova = `${d}. ${MJESECI[m - 1]}`;
  return sGodinom ? `${osnova} ${g}.` : osnova;
}

/** Datum za schema.org i Open Graph, s vremenskom zonom (ponoć u Zagrebu). */
export function isoSZonom(datum: string): string {
  // Prosinac je uvijek u zimskom vremenu (UTC+1).
  return `${datum}T00:00:00+01:00`;
}
