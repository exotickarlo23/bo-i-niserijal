# 12 dana do Božića

Adventski kalendar za božićni serijal kratkih videa o kolačima. Od 1. do 24. prosinca svaki drugi dan otvara se jedna kućica s klasičnim božićnim kolačem, receptom i pričom o njegovoj povijesti.

Stranica je izrađena u [Astru](https://astro.build) kao statična stranica, bez UI frameworka: čisti CSS i malo JavaScripta. Spremna je za objavu na Vercelu.

---

## Sadržaj

1. [Pokretanje na računalu](#1-pokretanje-na-računalu)
2. [Gdje je što](#2-gdje-je-što)
3. [Kako dodati ili urediti recept](#3-kako-dodati-ili-urediti-recept)
4. [Najava serijala](#4-najava-serijala)
5. [Kako zamijeniti slike](#5-kako-zamijeniti-slike)
6. [Kako uključiti sponzora](#6-kako-uključiti-sponzora)
7. [Preview mod za brendove](#7-preview-mod-za-brendove)
8. [Kako se vratašca otključavaju](#8-kako-se-vratašca-otključavaju)
9. [Deploy na Vercel](#9-deploy-na-vercel)
10. [SEO i dijeljenje](#10-seo-i-dijeljenje)
11. [Česti problemi](#11-česti-problemi)

---

## 1. Pokretanje na računalu

Potreban je [Node.js](https://nodejs.org) 22.23 ili noviji.

```bash
npm install
```

```bash
npm run dev
```

Stranica je tada na adresi http://localhost:4321. Svaka promjena u receptima vidi se odmah.

Prije objave možeš provjeriti cijeli build:

```bash
npm run build
```

Ako je nešto u receptima krivo upisano, build javlja grešku s nazivom datoteke i polja (vidi [Česti problemi](#11-česti-problemi)).

---

## 2. Gdje je što

| Što | Gdje |
| --- | --- |
| Recepti (12 datoteka) | `src/content/recepti/` |
| Najava serijala (1. 12.) | `src/content/uvod.md` |
| Opće postavke i sponzor | `src/config.ts` |
| Fotografije kolača | `public/slike/` |
| Logotip sponzora | `public/sponzor/` |
| Slika za dijeljenje početne stranice | `public/og.jpg` (1200 × 630) |
| Boje, fontovi, okvir | `src/styles/global.css` |
| Kalendar (raspored kućica, animacija) | `src/components/Kalendar.astro` |

Za uobičajeni rad trebaš samo prve četiri stavke.

---

## 3. Kako dodati ili urediti recept

Svaki kolač je jedna Markdown datoteka u `src/content/recepti/`. Ime datoteke počinje danom (`08-zvjezdice-s-cimetom.md`) samo radi preglednosti.

Sve što piše u **[UGLATIM ZAGRADAMA]** je placeholder koji treba zamijeniti. Dok je placeholder na mjestu, na stranici je prikazan prigušeno, s točkastim podcrtom, a Google za taj recept ne dobiva podatke (vidi [SEO](#10-seo-i-dijeljenje)).

### Gornji dio datoteke (frontmatter)

Dio između dvije linije `---` su podaci o receptu:

```yaml
naziv: Medenjaci
slug: medenjaci            # adresa stranice: /recept/medenjaci/
datum: 2026-12-02          # dan otvaranja vratašca (GGGG-MM-DD)

opis: "Jedna ili dvije rečenice za Google i dijeljenje na mrežama."

slika: /slike/medenjaci.jpg
slikaAlt: "Medenjaci na drvenoj dasci"

video:
  tiktok: "https://www.tiktok.com/@korisnik/video/1234567890123456789"
  instagram: ""
  youtube: ""

vrijemePripreme: 45        # u minutama
vrijemePecenja: 12         # u minutama
kolicina: "40 komada"

sastojci:
  - grupa: "Tijesto"
    stavke:
      - kolicina: "250 g"
        sastojak: "glatko brašno"
      - kolicina: "1"
        sastojak: "jaje"
  - grupa: "Glazura"
    stavke:
      - kolicina: "100 g"
        sastojak: "šećer u prahu"

koraci:
  - "Prvi korak."
  - "Drugi korak."

savjet: "Savjet za kraj."

sponsorProduct: ""
```

(Količine i sastojci iznad su samo primjer oblika, ne recept.)

| Polje | Obavezno | Opis |
| --- | --- | --- |
| `naziv` | da | Naziv kolača kako se prikazuje. |
| `slug` | da | Dio adrese: samo mala slova bez kvačica, brojke i crtice (`vanilin-kiflice`). **Ne mijenjaj ga nakon objave**, jer se time mijenja adresa stranice. |
| `datum` | da | Dan kad se vratašca otvaraju, u obliku `2026-12-08`. Dva recepta ne smiju imati isti datum. |
| `opis` | ne | Kratki opis za Google i pregled pri dijeljenju (do ~155 znakova). Ako ga nema, opis se slaže automatski. Prikazuje se i ispod naslova recepta. |
| `slika` | ne | Put do fotografije, zadano `/slike/[slug].jpg`. |
| `slikaAlt` | ne | Opis fotografije za slijepe i slabovidne i za Google. |
| `video` | ne | Poveznice na TikTok, Instagram i YouTube. Prazno se ne prikazuje (vidi dolje). |
| `vrijemePripreme` | ne | Broj minuta (`45`) ili tekst (`"1 h 30 min"`). |
| `vrijemePecenja` | ne | Isto kao gore. |
| `oznakaPecenja` | ne | Natpis umjesto „Pečenje”, npr. `"Prženje"` (već postavljeno kod fritula). |
| `kolicina` | ne | Npr. `"40 komada"` ili `"12 porcija"`. |
| `sastojci` | da | Grupe sastojaka (vidi dolje). |
| `koraci` | da | Postupak: jedna stavka je jedan numerirani korak. |
| `savjet` | ne | Savjet za kraj. Ako ga ne želiš, obriši cijeli redak. |
| `sponsorProduct` | ne | Proizvod sponzora korišten u receptu (vidi [Sponzor](#6-kako-uključiti-sponzora)). |

Polja koja nisu obavezna mogu se obrisati ili ostaviti prazna (`""`); tada se ne prikazuju.

### Sastojci

S grupama (npr. tijesto i glazura):

```yaml
sastojci:
  - grupa: "Tijesto"
    stavke:
      - kolicina: "250 g"
        sastojak: "brašno"
      - sastojak: "prstohvat soli"      # količina nije obavezna
  - grupa: "Glazura"
    stavke:
      - "100 g šećera u prahu"          # može i kao jedan redak teksta
```

Bez grupa, običan popis:

```yaml
sastojci:
  - kolicina: "250 g"
    sastojak: "brašno"
  - kolicina: "2"
    sastojak: "jaja"
```

Pazi na uvlačenje: YAML razlikuje razmake. Najlakše je kopirati postojeći redak i promijeniti tekst.

### Video

Zalijepi cijelu poveznicu na objavu:

- TikTok: `https://www.tiktok.com/@korisnik/video/1234567890123456789` (kratke poveznice tipa `vm.tiktok.com/...` ne rade; otvori video u pregledniku i kopiraj punu adresu)
- Instagram: `https://www.instagram.com/reel/ABC123xyz/`
- YouTube: `https://youtube.com/shorts/ABC123xyz` ili `https://www.youtube.com/watch?v=ABC123xyz`

Prvi popunjeni video (redom TikTok, Instagram, YouTube) ugrađuje se u stranicu, a ostali se nude kao poveznice ispod njega („Video je i na Instagramu i YouTubeu”). Ako nijedno polje nije popunjeno, dio s videom se ne prikazuje.

### Priča

Sve ispod drugog `---` je priča o kolaču, kao običan tekst. Odlomke odvoji praznim redom. Preporuka: 2 do 4 kratka odlomka.

```markdown
Prvi odlomak priče.

Drugi odlomak, s *kurzivom* za strane riječi i **podebljanim** tekstom.
```

Prvo slovo prvog odlomka automatski postaje ukrasni inicijal.

### Novi recept

1. Kopiraj postojeću datoteku u `src/content/recepti/` i preimenuj je.
2. Promijeni `naziv`, `slug` i `datum` (datum mora biti slobodan).
3. Kalendar ima 13 mjesta. Za više kućica treba dodati mjesta u rasporedu u `src/components/Kalendar.astro` (`grid-template-areas`), inače se nove kućice slažu na dno.

---

## 4. Najava serijala

Najava (1. prosinca, istaknuta kućica) uređuje se u `src/content/uvod.md`: naziv, datum, opis, video i tekst o serijalu. Stranica je na adresi `/uvod/` i automatski prikazuje raspored svih kolača iz mape s receptima. Prvi odlomak teksta prikazuje se istaknuto, u kurzivu.

---

## 5. Kako zamijeniti slike

1. Spremi fotografiju u `public/slike/` pod imenom `[slug].jpg`, npr. `public/slike/medenjaci.jpg`. Za najavu: `public/slike/uvod.jpg`.
2. To je sve: fotografija se pojavljuje u kućici kalendara, na vrhu recepta i pri dijeljenju na mrežama.

Popis imena:

| Kolač | Datoteka |
| --- | --- |
| Najava | `uvod.jpg` |
| Medenjaci | `medenjaci.jpg` |
| Vanilin kiflice | `vanilin-kiflice.jpg` |
| Speculaas | `speculaas.jpg` |
| Zvjezdice s cimetom | `zvjezdice-s-cimetom.jpg` |
| Paprenjaci | `paprenjaci.jpg` |
| Linzeri | `linzeri.jpg` |
| Bethmännchen | `bethmaennchen.jpg` |
| Fritule | `fritule.jpg` |
| Orahnjača i makovnjača | `orahnjaca-i-makovnjaca.jpg` |
| Mince pies | `mince-pies.jpg` |
| Stollen | `stollen.jpg` |
| Božićni panj | `bozicni-panj.jpg` |

Savjeti:

- Prihvaćeni su i `.jpeg`, `.png` i `.webp`.
- Možeš ubaciti originalnu fotografiju s mobitela ili fotoaparata. Pri buildu se automatski smanjuje u više veličina (WebP), pa mobiteli ne skidaju velike datoteke. Ipak je preporuka ne veća od ~3000 px po dužoj strani.
- Fotografija na vrhu recepta reže se na široki format (na mobitelu 4:3, na računalu 21:9), a u kalendaru na oblik kućice. Glavni motiv neka bude u sredini kadra.
- Slika za dijeljenje recepta (1200 × 630) i slike za Google (1:1, 4:3, 16:9) rade se same iz iste fotografije.
- Dok fotografije nema, prikazuje se krem placeholder sa zlatnom zvjezdicom i nazivom kolača.
- Slika za dijeljenje početne stranice je `public/og.jpg` (1200 × 630). Možeš je zamijeniti svojom istih dimenzija.

---

## 6. Kako uključiti sponzora

U `src/config.ts` zamijeni `null` podacima brenda:

```ts
export const sponsor: Sponzor | null = {
  name: 'Ime brenda',
  logo: '/sponzor/logo.svg',
  url: 'https://www.brend.hr',
};
```

Logotip spremi u `public/sponzor/` (najbolje SVG ili PNG s prozirnom pozadinom). Za probu postoji `public/sponzor/primjer-logo.svg`.

Kad je sponzor uključen:

- u zaglavlju piše **12 dana do Božića × [logo]**,
- na dnu svakog recepta i na stranici najave je blok **Serijal u suradnji s [brend]** s poveznicom,
- uz sastojke se diskretno prikazuje proizvod iz polja `sponsorProduct`.

Proizvod se upisuje u recept:

```yaml
sponsorProduct: "Naziv proizvoda"
```

ili s poveznicom na proizvod:

```yaml
sponsorProduct:
  naziv: "Naziv proizvoda"
  url: "https://www.brend.hr/proizvod"
```

Kad je `sponsor` postavljen na `null`, sponzor se nigdje ne prikazuje, ni proizvodi iz recepata. Poveznice prema sponzoru imaju oznaku `rel="sponsored"`, kako Google traži za plaćene suradnje.

---

## 7. Preview mod za brendove

Dodaj `?preview=1` na kraj adrese:

```
https://tvoja-domena.hr/?preview=1
```

U preview modu:

- sve kućice i svi recepti su otključani, bez obzira na datum,
- poveznice unutar stranice zadržavaju `?preview=1`, pa se može slobodno klikati,
- na vrhu stranice je diskretna traka „Pregled: sve je otključano” s gumbom **Zatvori vratašca** (zatvara sva vratašca, da animaciju možeš pokazati ispočetka) i poveznicom **Izađi iz pregleda**,
- otvorena vratašca pamte se odvojeno od običnog načina, pa probe u pitchu ne utječu na pravi kalendar.

Bez parametra stranica radi normalno, po datumima.

Napomena: `?preview=1` nije lozinka. Tko dobije takvu poveznicu, vidi sve recepte. Za tajni pitch šalji poveznicu samo onima kojima je namijenjena.

---

## 8. Kako se vratašca otključavaju

- Svaka kućica i svaki recept otključavaju se **u ponoć svog datuma po zagrebačkom vremenu**, neovisno o tome gdje je posjetitelj.
- Zaključana kućica na klik prikazuje „Otvara se 8. prosinca”. Otključanu kućicu posjetitelj otvara klikom; otvorena vratašca pamte se u pregledniku i ostaju otvorena pri sljedećem posjetu.
- Tko pogodi adresu zaključanog recepta, vidi stranicu „Ovaj kolač stiže X. prosinca” s povratkom na kalendar.
- Klik na sliku u otvorenoj kućici vodi na recept.
- Animacija vratašca poštuje postavku „smanji pokrete” (prefers-reduced-motion): tada se vratašca otvaraju bez animacije.

**Kako to radi na statičnoj stranici.** Stranica nema poslužitelj koji bi provjeravao datum, pa provjeru radi preglednik. Recepti koji u trenutku builda još nisu objavljeni spremljeni su u stranicu skriveno i prikazuju se tek kad stigne datum. Za kalendar s kolačima to je sasvim dovoljno, ali tko zna čitati izvorni kod stranice može ih vidjeti ranije.

Recepti čiji je datum prošao u trenutku builda upisani su izravno u HTML, što je najbolje za Google. Zato je dobro napraviti novi deploy nakon što se vratašca otvore. To se događa samo od sebe kad objaviš bilo koju izmjenu (npr. upišeš video poveznicu nakon objave epizode), a može se i automatizirati:

**Opcionalno: automatski build svaki dan u ponoć.** U repozitoriju je `.github/workflows/dnevni-build.yml`, koji od 1. do 24. prosinca malo iza ponoći pokreće novi deploy. Uključuje se ovako:

1. Na Vercelu: projekt → **Settings → Git → Deploy Hooks**, napravi hook (npr. ime „dnevni”, grana `main`) i kopiraj adresu.
2. Na GitHubu: repozitorij → **Settings → Secrets and variables → Actions → New repository secret**, ime `VERCEL_DEPLOY_HOOK`, vrijednost je kopirana adresa.

Bez te tajne datoteka ne radi ništa.

---

## 9. Deploy na Vercel

1. Postavi projekt na GitHub (ako već nije).
2. Na [vercel.com](https://vercel.com) odaberi **Add New → Project** i uvezi repozitorij.
3. Vercel sam prepoznaje Astro. Postavke ostavi kakve jesu (build: `npm run build`, mapa: `dist`).
4. Klikni **Deploy**.

Svaki push na glavnu granu automatski objavljuje novu verziju, a ostale grane dobivaju zasebnu probnu adresu.

**Važno: javna adresa prikazuje granu `main`.** Glavna adresa projekta (npr. `bo-i-niserijal.vercel.app`) uvijek prikazuje ono što je na grani `main`. Ako je kod na nekoj drugoj grani, treba je spojiti u `main` (na GitHubu: **Pull request → Merge**). Dok se to ne napravi, glavna adresa javlja Vercelovu grešku „404: NOT_FOUND”.

Probne adrese ostalih grana zaštićene su Vercelovom prijavom i vidiš ih samo ti. Brendovima zato šalji glavnu adresu, uz `?preview=1`.

**Vlastita domena:** projekt → **Settings → Domains** i slijedi upute. Adresa stranice za sitemap, Open Graph i Google podatke postavlja se automatski iz glavne domene projekta. Ako je ipak želiš zadati ručno, upiši je u `adresa` u `src/config.ts` (npr. `'https://12danadobozica.hr'`).

**Node.js:** projekt traži Node 22.23 ili noviji (zapisano u `package.json`), pa Vercel sam odabire odgovarajuću verziju.

---

## 10. SEO i dijeljenje

Za svaku stranicu automatski se izrađuju:

- `lang="hr"`, naslov i meta opis,
- Open Graph i Twitter/X kartica: kod recepta s fotografijom i nazivom kolača, kod početne stranice s `public/og.jpg`,
- na receptima schema.org **Recipe** podaci (JSON-LD) iz frontmattera: sastojci, koraci, vremena pripreme i pečenja, količina, fotografije u tri omjera, datum, autor i video,
- sitemap (`/sitemap-index.xml`) i `robots.txt`.

Google dobiva Recipe podatke tek kad recept ima upisane sastojke i korake (placeholderi se preskaču) i kad je objavljen. Za rich results Google traži i fotografiju. Provjera: [Rich Results Test](https://search.google.com/test/rich-results).

U `src/config.ts` upiši `autor` (tvoje ime ili naziv kanala) i poveznice na društvene mreže; prikazuju se u podnožju, a autor ide i u Google podatke.

**Fontovi.** Playfair Display i Lato učitavaju se s Google Fontsa. Lato na Google Fontsu nema slova č, đ, Č i Đ, pa ih stranica dopunjava malom datotekom (oko 3 KB) iz službenog Lata 2.015 (`public/fonts/`, licenca SIL OFL u `public/fonts/OFL.txt`). Ostala slova i dalje dolaze s Google Fontsa.

---

## 11. Česti problemi

**Build javlja grešku u receptu.** Poruka navodi datoteku i polje. Najčešći uzroci:

- Datum nije u obliku `2026-12-08`.
- Tekst sadrži dvotočku ili počinje navodnikom, a nije u navodnicima. Rješenje: tekst uvijek stavi u navodnike: `opis: "Recept: brz i jednostavan"`.
- Unutar teksta u navodnicima trebaju navodnici. Koristi hrvatske „ ” ili jednostruke vanjske navodnike: `savjet: 'Kako kaže baka: "polako"'`.
- Uvlačenje kod sastojaka nije poravnato s retkom iznad.
- `slug` sadrži velika slova, razmake ili kvačice.
- Dva recepta imaju isti `datum`.

**Fotografija se ne prikazuje.** Provjeri da je ime datoteke isto kao `slug` (mala slova, crtice) i da je u mapi `public/slike/`. Nakon dodavanja fotografije treba novi build ili deploy.

**Video se ne prikazuje.** Provjeri da je poveznica cijela (za TikTok mora sadržavati `/video/` i broj).

**Recept se ne otvara iako je datum prošao.** Provjeri `datum` u receptu. Za probu prije datuma koristi `?preview=1`.
