import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Sheme sadržaja. Ovdje se provjerava je li frontmatter u Markdown
 * datotekama ispravan; ako nešto nedostaje, build javlja grešku s
 * nazivom datoteke i polja.
 */

/** Tekst koji smije biti prazan (prazno, null i nedostajuće polje postaju ''). */
const tekst = z
  .string()
  .nullish()
  .transform((v) => (v ?? '').trim());

/**
 * Datum u obliku GGGG-MM-DD (npr. 2026-12-08). Interno se čuva kao tekst "2026-12-08".
 * Strogo: "8.12.2026." ili "12/08/2026" javljaju grešku (inače bi ih JavaScript
 * mogao protumačiti kao neki drugi dan i otključati recept prerano).
 */
const PORUKA_DATUM = 'Datum mora biti u obliku GGGG-MM-DD, npr. 2026-12-08.';
const datum = z.any().transform((v, ctx) => {
  let iso = '';
  if (v instanceof Date && !Number.isNaN(v.getTime())) iso = v.toISOString().slice(0, 10);
  else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.trim())) iso = v.trim();

  const provjera = iso ? new Date(`${iso}T00:00:00Z`) : null;
  if (!provjera || Number.isNaN(provjera.getTime()) || provjera.toISOString().slice(0, 10) !== iso) {
    ctx.addIssue({ code: 'custom', message: PORUKA_DATUM });
    return z.NEVER;
  }
  return iso;
});

/** Poveznice na video epizode. Prazno polje se ne prikazuje. */
const video = z
  .object({
    tiktok: tekst,
    instagram: tekst,
    youtube: tekst,
  })
  .nullish()
  .transform((v) => v ?? { tiktok: '', instagram: '', youtube: '' });

/** Vrijeme u minutama (npr. 45) ili tekst (npr. "1 h 30 min" ili "[MINUTE]"). */
const vrijeme = z.union([z.number().nonnegative(), z.string()]).nullish();

/** Jedan sastojak: tekst ("250 g brašna") ili par količina + sastojak. */
const sastojak = z.union([
  z.string(),
  z.object({
    kolicina: z.union([z.string(), z.number()]).nullish(),
    sastojak: z.string(),
  }),
]);

/** Grupa sastojaka, npr. "Tijesto" ili "Glazura". */
const grupaSastojaka = z.object({
  grupa: tekst,
  stavke: z.array(sastojak).min(1, 'Grupa sastojaka mora imati barem jednu stavku.'),
});

/** Proizvod sponzora: naziv ili { naziv, url }. */
const proizvodSponzora = z
  .union([
    z.string(),
    z.object({
      naziv: z.string(),
      url: tekst,
    }),
  ])
  .nullish();

const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug smije imati samo mala slova bez kvačica, brojke i crtice, npr. "vanilin-kiflice".',
  );

const recepti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recepti' }),
  schema: z.object({
    naziv: z.string().min(1),
    slug,
    datum,
    opis: tekst,
    slika: tekst,
    slikaAlt: tekst,
    video,
    vrijemePripreme: vrijeme,
    vrijemePecenja: vrijeme,
    /** Natpis za vrijeme pečenja (npr. "Prženje" za fritule). */
    oznakaPecenja: tekst,
    kolicina: z.union([z.string(), z.number()]).nullish(),
    /** Grupe sastojaka ili običan popis sastojaka. */
    sastojci: z.union([z.array(grupaSastojaka), z.array(sastojak)]),
    koraci: z.array(z.string()).min(1, 'Recept mora imati barem jedan korak.'),
    savjet: tekst,
    sponsorProduct: proizvodSponzora,
  }),
});

const uvod = defineCollection({
  loader: glob({ pattern: 'uvod.md', base: './src/content' }),
  schema: z.object({
    naziv: z.string().min(1),
    datum,
    opis: tekst,
    slika: tekst,
    slikaAlt: tekst,
    video,
  }),
});

export const collections = { recepti, uvod };
