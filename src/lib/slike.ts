/**
 * Fotografije kolača iz public/slike/.
 *
 * Datoteke se čitaju pri buildu i automatski smanjuju u više veličina (WebP),
 * pa mobiteli ne skidaju velike originale. Ako fotografije nema, komponente
 * prikazuju elegantan placeholder s nazivom kolača.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const datoteke = import.meta.glob<{ default: ImageMetadata }>(
  '../../public/slike/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

/** Ključ: "/slike/medenjaci.jpg" (mala slova). */
const poPutu = new Map<string, ImageMetadata>();
/** Ključ: "medenjaci" (naziv bez nastavka, mala slova). */
const poImenu = new Map<string, ImageMetadata>();

for (const [put, modul] of Object.entries(datoteke)) {
  const ime = put.slice(put.lastIndexOf('/') + 1).toLowerCase();
  poPutu.set(`/slike/${ime}`, modul.default);
  poImenu.set(ime.replace(/\.[^.]+$/, ''), modul.default);
}

/**
 * Pronalazi fotografiju po putu iz frontmattera ("/slike/medenjaci.jpg").
 * Ako točan put ne postoji, traži istu datoteku s drugim nastavkom (.jpeg, .png, .webp).
 */
export function pronadiSliku(put: string | undefined | null, rezervniSlug?: string): ImageMetadata | null {
  const kandidati: string[] = [];
  if (put && put.trim()) {
    const p = put.trim().toLowerCase().replace(/^\/?(public\/)?/, '/');
    kandidati.push(p);
  }
  for (const k of kandidati) {
    const nadena = poPutu.get(k);
    if (nadena) return nadena;
    const ime = k.slice(k.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    const poIme = poImenu.get(ime);
    if (poIme) return poIme;
  }
  if (rezervniSlug) return poImenu.get(rezervniSlug.toLowerCase()) ?? null;
  return null;
}

export interface ResponzivnaSlika {
  src: string;
  srcset: string;
  sirina: number;
  visina: number;
}

const SIRINE = [360, 540, 720, 960, 1280, 1600, 2000];

/** Više veličina iste fotografije (WebP) za atribut srcset. */
export async function responzivna(slika: ImageMetadata, najvecaSirina = 2000): Promise<ResponzivnaSlika> {
  const granica = Math.min(slika.width, najvecaSirina);
  let sirine = SIRINE.filter((s) => s <= granica);
  if (!sirine.length || sirine[sirine.length - 1] < granica) sirine = [...sirine, granica];

  const rezultat = await getImage({ src: slika, widths: sirine, format: 'webp', quality: 80 });
  return {
    src: rezultat.src,
    srcset: rezultat.srcSet.attribute,
    sirina: slika.width,
    visina: slika.height,
  };
}

/** Izrezana JPG verzija zadanih dimenzija (za dijeljenje i Google). */
export async function izrez(slika: ImageMetadata, sirina: number, visina: number) {
  const rezultat = await getImage({
    src: slika,
    width: sirina,
    height: visina,
    fit: 'cover',
    format: 'jpg',
    quality: 82,
  });
  return { src: rezultat.src, sirina, visina };
}
