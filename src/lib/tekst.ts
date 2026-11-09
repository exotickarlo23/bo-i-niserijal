/** Pomoćne funkcije za tekst iz frontmattera. */

/** Je li vrijednost placeholder u uglatim zagradama, npr. "[SASTOJAK]". */
export function jePlaceholder(v: unknown): boolean {
  return typeof v === 'string' && /^\s*\[[^\]]*\]\s*$/.test(v);
}

/** Je li polje stvarno popunjeno (nije prazno i nije placeholder). */
export function jePopunjeno(v: unknown): v is string | number {
  if (typeof v === 'number') return true;
  return typeof v === 'string' && v.trim() !== '' && !jePlaceholder(v);
}

/** Pretvara vrijeme iz frontmattera u minute: 45, "45", "45 min", "1 h 30 min", "2 sata". */
export function uMinute(v: number | string | null | undefined): number | null {
  if (typeof v === 'number') return v > 0 ? Math.round(v) : null;
  if (!jePopunjeno(v)) return null;
  const s = String(v).toLowerCase().replace(',', '.').trim();
  if (/^\d+$/.test(s)) return Number(s);

  let ukupno = 0;
  let nasao = false;
  const sati = s.match(/(\d+(?:\.\d+)?)\s*(h\b|sat)/);
  if (sati) {
    ukupno += parseFloat(sati[1]) * 60;
    nasao = true;
  }
  const minute = s.match(/(\d+)\s*(min|m\b)/);
  if (minute) {
    ukupno += Number(minute[1]);
    nasao = true;
  }
  return nasao && ukupno > 0 ? Math.round(ukupno) : null;
}

/** 90 → "1 h 30 min", 45 → "45 min", 120 → "2 h" */
export function formatirajMinute(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

/** 90 → "PT1H30M" (ISO 8601 trajanje za schema.org) */
export function isoTrajanje(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `PT${h ? `${h}H` : ''}${m || !h ? `${m}M` : ''}`;
}

/** Vrijeme za prikaz: broj minuta se formatira, tekst ostaje kakav jest. */
export function prikazVremena(v: number | string | null | undefined): string {
  const min = uMinute(v);
  if (min !== null && (typeof v === 'number' || /^\d+$/.test(String(v).trim()))) {
    return formatirajMinute(min);
  }
  return v === null || v === undefined ? '' : String(v).trim();
}
