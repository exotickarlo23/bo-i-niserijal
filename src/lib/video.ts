/**
 * Video epizode: iz poveznice na TikTok, Instagram ili YouTube
 * izvlači adresu za ugradnju (embed).
 */

export type Platforma = 'tiktok' | 'instagram' | 'youtube';

export interface Video {
  platforma: Platforma;
  naziv: string;
  /** Izvorna poveznica (za gumb "Pogledaj na ..."). */
  url: string;
  /** Adresa za <iframe>, ili null ako se poveznica ne može ugraditi. */
  embed: string | null;
  /** Uspravni (9:16) video: TikTok, Instagram Reels, YouTube Shorts. */
  uspravno: boolean;
}

const NAZIVI: Record<Platforma, string> = {
  tiktok: 'TikToku',
  instagram: 'Instagramu',
  youtube: 'YouTubeu',
};

/** Redoslijed: prvi popunjeni video se ugrađuje, ostali se nude kao poveznice. */
export const REDOSLIJED: Platforma[] = ['tiktok', 'instagram', 'youtube'];

function youtube(url: URL): string | null {
  const host = url.hostname.replace(/^www\.|^m\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    id = url.searchParams.get('v');
    const put = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,})/);
    if (!id && put) id = put[1];
  }
  return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

function tiktok(url: URL): string | null {
  const id = url.pathname.match(/\/video\/(\d{8,})/)?.[1];
  return id ? `https://www.tiktok.com/player/v1/${id}?rel=0&description=1` : null;
}

function instagram(url: URL): string | null {
  const m = url.pathname.match(/^\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/);
  if (!m) return null;
  const vrsta = m[1] === 'p' ? 'p' : 'reel';
  return `https://www.instagram.com/${vrsta}/${m[2]}/embed/`;
}

function pripremi(platforma: Platforma, poveznica: string): Video | null {
  const ociscena = poveznica.trim();
  if (!ociscena || ociscena.startsWith('[')) return null;

  let url: URL;
  try {
    url = new URL(ociscena);
  } catch {
    console.warn(`[12 dana] Video poveznica nije ispravna: "${ociscena}"`);
    return null;
  }

  const embed =
    platforma === 'youtube' ? youtube(url) : platforma === 'tiktok' ? tiktok(url) : instagram(url);

  if (!embed) {
    console.warn(
      `[12 dana] ${platforma}: poveznicu "${ociscena}" nije moguće ugraditi; prikazuje se samo kao poveznica.`,
    );
  }

  const uspravno = platforma !== 'youtube' || /\/shorts\//.test(url.pathname);
  return { platforma, naziv: NAZIVI[platforma], url: ociscena, embed, uspravno };
}

/** Svi popunjeni videi, po redoslijedu prikaza. */
export function pripremiVidee(polja: Partial<Record<Platforma, string>>): Video[] {
  return REDOSLIJED.map((p) => pripremi(p, polja[p] ?? '')).filter((v): v is Video => v !== null);
}
