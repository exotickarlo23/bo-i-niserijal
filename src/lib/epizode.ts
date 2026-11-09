/**
 * Epizode serijala: najava (uvod) + recepti, poredani po datumu.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { danUMjesecu } from './datumi';

export type Recept = CollectionEntry<'recepti'>;
export type Uvod = CollectionEntry<'uvod'>;

export interface Epizoda {
  vrsta: 'uvod' | 'recept';
  /** Jedinstveni ključ (slug recepta ili "uvod"). */
  kljuc: string;
  naziv: string;
  datum: string;
  dan: number;
  url: string;
  /** Put do fotografije iz frontmattera, npr. "/slike/medenjaci.jpg". */
  slika: string;
  slikaAlt: string;
  /** Redni broj po datumu (0 = najava). */
  indeks: number;
}

export function urlRecepta(slug: string): string {
  return `/recept/${slug}/`;
}

export const URL_UVODA = '/uvod/';

/** Svi recepti poredani po datumu. Javlja grešku ako se datum ili slug ponavljaju. */
export async function dohvatiRecepte(): Promise<Recept[]> {
  const recepti = (await getCollection('recepti')).sort((a, b) => a.data.datum.localeCompare(b.data.datum));

  const datumi = new Map<string, string>();
  for (const r of recepti) {
    const postojeci = datumi.get(r.data.datum);
    if (postojeci) {
      throw new Error(
        `Dva recepta imaju isti datum ${r.data.datum}: "${postojeci}" i "${r.data.naziv}". Svaki kolač treba svoj dan.`,
      );
    }
    datumi.set(r.data.datum, r.data.naziv);
  }
  return recepti;
}

export async function dohvatiUvod(): Promise<Uvod> {
  const [uvod] = await getCollection('uvod');
  if (!uvod) throw new Error('Nedostaje datoteka src/content/uvod.md (najava serijala).');
  return uvod;
}

/** Najava + svi recepti kao jedan kronološki popis (za kalendar i raspored). */
export async function dohvatiEpizode(): Promise<Epizoda[]> {
  const [uvod, recepti] = await Promise.all([dohvatiUvod(), dohvatiRecepte()]);

  const epizode: Omit<Epizoda, 'indeks'>[] = [
    {
      vrsta: 'uvod',
      kljuc: 'uvod',
      naziv: uvod.data.naziv,
      datum: uvod.data.datum,
      dan: danUMjesecu(uvod.data.datum),
      url: URL_UVODA,
      slika: uvod.data.slika || '/slike/uvod.jpg',
      slikaAlt: uvod.data.slikaAlt,
    },
    ...recepti.map((r) => ({
      vrsta: 'recept' as const,
      kljuc: r.data.slug,
      naziv: r.data.naziv,
      datum: r.data.datum,
      dan: danUMjesecu(r.data.datum),
      url: urlRecepta(r.data.slug),
      slika: r.data.slika || `/slike/${r.data.slug}.jpg`,
      slikaAlt: r.data.slikaAlt,
    })),
  ];

  return epizode
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .map((e, indeks) => ({ ...e, indeks }));
}
