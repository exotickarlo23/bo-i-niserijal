/**
 * ════════════════════════════════════════════════════════════════
 *  POSTAVKE STRANICE · 12 dana do Božića
 *
 *  Ovo je jedina datoteka s općim postavkama. Recepti se uređuju
 *  u mapi src/content/recepti/, a najava serijala u src/content/uvod.md.
 * ════════════════════════════════════════════════════════════════
 */

export interface Sponzor {
  /** Ime brenda, točno kako se piše (npr. "Ime brenda"). */
  name: string;
  /** Put do logotipa u mapi public/ (npr. "/sponzor/logo.svg"). Najbolje SVG ili PNG s prozirnom pozadinom. */
  logo: string;
  /** Web adresa brenda (npr. "https://www.brend.hr"). */
  url: string;
  /** Opcionalno: kratka poruka u istaknutom bloku sponzora (jedna do dvije rečenice). */
  message?: string;
}

/**
 * SPONZOR
 *
 * null  → serijal bez sponzora; sponzor se nigdje ne spominje.
 *
 * Za uključivanje zamijeni `null` podacima brenda, na primjer:
 *
 *   export const sponsor: Sponzor | null = {
 *     name: 'Ime brenda',
 *     logo: '/sponzor/primjer-logo.svg',
 *     url: 'https://www.primjer.hr',
 *     message: 'Jedna do dvije rečenice o suradnji (opcionalno).',
 *   };
 *
 * Logotip spremi u public/sponzor/. Kad je sponzor uključen:
 *  · u zaglavlju piše „12 dana do Božića × [logo]”
 *  · na početnoj stranici ispod kalendara, na dnu svakog recepta i na najavi
 *    je istaknuti blok „Serijal u suradnji s” s logotipom, porukom i poveznicom
 *  · uz sastojke se prikazuje proizvod iz polja sponsorProduct (ako je upisan u receptu)
 */
export const sponsor: Sponzor | null = null;

/** Opći podaci o stranici. */
export const stranica = {
  naziv: '12 dana do Božića',

  /** Opis za Google i dijeljenje početne stranice. */
  opis:
    'Adventski kalendar božićnih kolača: od 1. do 24. prosinca svaki drugi dan jedan klasični božićni kolač, recept i priča o njegovoj povijesti.',

  /** Godina serijala (prikazuje se uz datume). */
  godina: 2026,

  /**
   * Tvoje ime ili naziv kanala. Prikazuje se u podnožju i šalje Googleu kao autor recepata.
   * Prazno = ne prikazuje se.
   */
  autor: '',

  /**
   * Javna adresa stranice, npr. 'https://12danadobozica.hr'.
   * Na Vercelu ostavi prazno: adresa se postavlja automatski.
   */
  adresa: '',

  /** Poveznice na tvoje profile (prazno = ne prikazuje se). */
  drustveneMreze: {
    tiktok: '',
    instagram: '',
    youtube: '',
  },
};
