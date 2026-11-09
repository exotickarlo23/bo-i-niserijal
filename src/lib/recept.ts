/**
 * Priprema podataka recepta za prikaz i za schema.org (Google rich results).
 */
import type { ImageMetadata } from 'astro';
import { stranica } from '../config';
import { formatirajDatum, isoSZonom } from './datumi';
import type { Recept } from './epizode';
import { urlRecepta } from './epizode';
import { izrez } from './slike';
import { isoTrajanje, jePlaceholder, jePopunjeno, uMinute } from './tekst';
import type { Video } from './video';

export interface Stavka {
  kolicina: string;
  sastojak: string;
}

export interface GrupaSastojaka {
  grupa: string;
  stavke: Stavka[];
}

type SirovaStavka = string | { kolicina?: string | number | null; sastojak: string };
type SiroviSastojci = Recept['data']['sastojci'];

function stavka(s: SirovaStavka): Stavka {
  if (typeof s === 'string') return { kolicina: '', sastojak: s.trim() };
  return { kolicina: s.kolicina === null || s.kolicina === undefined ? '' : String(s.kolicina).trim(), sastojak: s.sastojak.trim() };
}

/** Sastojci uvijek kao grupe (običan popis postaje jedna grupa bez naslova). */
export function grupeSastojaka(sastojci: SiroviSastojci): GrupaSastojaka[] {
  const jeGrupa = (x: unknown): x is { grupa: string; stavke: SirovaStavka[] } =>
    typeof x === 'object' && x !== null && 'stavke' in x;

  if (sastojci.length && sastojci.every(jeGrupa)) {
    return (sastojci as { grupa: string; stavke: SirovaStavka[] }[]).map((g) => ({
      grupa: jePopunjeno(g.grupa) || jePlaceholder(g.grupa) ? g.grupa : '',
      stavke: g.stavke.map(stavka),
    }));
  }
  return [{ grupa: '', stavke: (sastojci as SirovaStavka[]).map(stavka) }];
}

/** Opis za Google i dijeljenje: iz frontmattera ili automatski. */
export function opisRecepta(r: Recept): string {
  if (jePopunjeno(r.data.opis)) return r.data.opis;
  return `${r.data.naziv}: recept i priča o povijesti ovog božićnog kolača. ${stranica.naziv}, epizoda ${formatirajDatum(r.data.datum)}.`;
}

/**
 * schema.org/Recipe iz frontmattera. Placeholderi se preskaču; ako recept još
 * nema upisane sastojke ili korake, vraća null (Google tada ništa ne dobiva).
 */
export async function receptJsonLd(
  r: Recept,
  site: URL,
  slika: ImageMetadata | null,
  videi: Video[],
): Promise<Record<string, unknown> | null> {
  const d = r.data;

  const sastojci = grupeSastojaka(d.sastojci)
    .flatMap((g) => g.stavke)
    .filter((s) => jePopunjeno(s.sastojak) && !jePlaceholder(s.kolicina))
    .map((s) => `${s.kolicina} ${s.sastojak}`.trim());

  const koraci = d.koraci.filter(jePopunjeno).map((tekst, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    text: tekst.trim(),
  }));

  if (!sastojci.length || !koraci.length) return null;

  const url = new URL(urlRecepta(d.slug), site).href;
  const opis = opisRecepta(r);

  // Google preporučuje slike u omjerima 1:1, 4:3 i 16:9.
  const slike = slika
    ? await Promise.all(
        [
          [1200, 1200],
          [1200, 900],
          [1200, 675],
        ].map(([w, h]) => izrez(slika, w, h)),
      )
    : [];
  const sl = slike.map((s) => new URL(s.src, site).href);

  const priprema = uMinute(d.vrijemePripreme);
  const pecenje = uMinute(d.vrijemePecenja);
  const kolicina = d.kolicina === null || d.kolicina === undefined ? '' : String(d.kolicina);

  const video = videi.find((v) => v.embed);

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: d.naziv,
    description: opis,
    url,
    mainEntityOfPage: url,
    inLanguage: 'hr',
    datePublished: d.datum,
    recipeCategory: 'Desert',
    keywords: `božićni kolači, ${d.naziv}, ${stranica.naziv}`,
    recipeIngredient: sastojci,
    recipeInstructions: koraci,
  };

  if (sl.length) ld.image = sl;
  if (jePopunjeno(stranica.autor)) ld.author = { '@type': 'Person', name: stranica.autor };
  if (priprema) ld.prepTime = isoTrajanje(priprema);
  if (pecenje) ld.cookTime = isoTrajanje(pecenje);
  if (jePopunjeno(kolicina)) ld.recipeYield = kolicina;

  if (video && sl.length) {
    ld.video = {
      '@type': 'VideoObject',
      name: `${d.naziv} · ${stranica.naziv}`,
      description: opis,
      thumbnailUrl: sl,
      uploadDate: isoSZonom(d.datum),
      embedUrl: video.embed,
      url: video.url,
    };
  }

  return ld;
}
