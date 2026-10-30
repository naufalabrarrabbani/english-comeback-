# English Comeback

Rencana belajar Bahasa Inggris 6 bulan (Nov 2026 – Apr 2027). Next.js App Router
+ TypeScript + CSS biasa (tanpa Tailwind). Semua client-side, siap hosting
gratis di Vercel.

## Halaman

- `/` — Hero + roadmap interaktif 3 fase / 6 bulan (tab per bulan)
- `/kosakata` — Vocabulary Lab: 2.868 kata Oxford 3000 (level CEFR A1–B2),
  pencarian, filter level, kartu kata (IPA + audio + definisi via
  dictionaryapi.dev), tandai hafal/belajar (localStorage), mode "10 kata hari
  ini" deterministik per tanggal
- `/kamus` — Lookup kata bebas ala Cambridge/Merriam-Webster (dictionaryapi.dev)
- `/tata-bahasa` — 8 parts of speech + 6 tenses inti (formula + contoh + tombol
  suara via speechSynthesis)
- `/ritual` — Protokol harian 75 menit + ritual setelah konsumsi materi

## Data

`lib/words.json` — 2.868 entri `[kata, partOfSpeech, levelCEFR]`, diekstrak dari
PDF Oxford 3000 (Drive). Jangan unduh ulang kecuali sumbernya berubah.

## Jalankan lokal

```sh
npm install
npm run dev
```

## Deploy ke Vercel (gratis)

1. Push repo ini ke GitHub:
   ```sh
   git remote add origin https://github.com/<username>/english-comeback.git
   git branch -M main
   git push -u origin main
   ```
2. Buka https://vercel.com/new → Import Git Repository → pilih repo ini.
3. Framework terdeteksi otomatis (Next.js). Klik Deploy. Selesai — tidak perlu
   env var, tidak perlu setting build khusus (`npm run build` default).

Audio pengucapan memakai API gratis dictionaryapi.dev saat runtime (dengan
fallback ke suara bawaan browser), jadi tidak ada API key yang perlu disimpan.
