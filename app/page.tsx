"use client";

import { useState } from "react";

interface Month {
  n: number;
  label: string;
  phase: string;
  title: string;
  focus: string;
  items: string[];
}

const MONTHS: Month[] = [
  {
    n: 1,
    label: "Bulan 1 · Nov 2026",
    phase: "Fase 1 — Fondasi",
    title: "Telinga dan mulut dulu",
    focus:
      "Targetnya bukan hafal banyak, tapi berani bunyi. 250 kata A1 pertama + bisa baca simbol phonetic (IPA) + shadowing tiap hari.",
    items: [
      "250 kata A1 pertama dari halaman Kosakata (tandai yang sudah hafal)",
      "Belajar baca simbol IPA: vokal panjang/pendek dan bunyi yang tidak ada di Indonesia (th, v, z)",
      "Shadowing 5 menit/hari: dengarkan audio kata/kalimat, tirukan dengan suara keluar",
      "Aturan: tiap kata baru wajib diucapkan 3x sebelum dianggap dipelajari",
    ],
  },
  {
    n: 2,
    label: "Bulan 2 · Des 2026",
    phase: "Fase 1 — Fondasi",
    title: "Dari kata jadi kalimat",
    focus:
      "250 kata A1 lanjutan + 6 tenses inti dikenalkan sebagai pola (bukan dihafal mati) + mulai menulis kalimat sendiri.",
    items: [
      "250 kata A1 berikutnya (total 500)",
      "Kenalan dengan 6 tenses inti — cukup paham polanya, lihat halaman Tata Bahasa",
      "Tulis 5 kalimat English per hari memakai kata yang baru dipelajari",
      "Ucapkan semua kalimat yang ditulis dengan suara keluar",
    ],
  },
  {
    n: 3,
    label: "Bulan 3 · Jan 2027",
    phase: "Fase 2 — Ekspansi",
    title: "Masuk ke bacaan nyata",
    focus:
      "300 kata B1 + baca 1 artikel English per hari + listening 10 menit. Tujuannya: ketemu kata di alam liar, bukan cuma di daftar.",
    items: [
      "300 kata B1 pertama",
      "Baca 1 artikel pendek English per hari (teknologi, berita ringan) — catat 5 kata baru",
      "Listening 10 menit/hari: video/podcast English dengan subtitle English",
      "Review tenses: pakai Simple Past dan Present Perfect saat menulis jurnal",
    ],
  },
  {
    n: 4,
    label: "Bulan 4 · Feb 2027",
    phase: "Fase 2 — Ekspansi",
    title: "Buku English pertama",
    focus:
      "300 kata B1 lanjutan + mulai baca 1 buku English (graded reader level menengah) + semua tenses dipakai aktif saat menulis.",
    items: [
      "300 kata B1 berikutnya (total 600 kata B1)",
      "Baca buku English 10–15 halaman/hari — tandai kalimat yang strukturnya menarik",
      "Latihan: tulis ulang 1 paragraf bacaan dengan kata-katamu sendiri (recall)",
      "Shadowing naik jadi 10 menit/hari",
    ],
  },
  {
    n: 5,
    label: "Bulan 5 · Mar 2027",
    phase: "Fase 3 — Fluency + Tes",
    title: "Ngomong tanpa naskah",
    focus:
      "300 kata B2 + speaking: ceritakan ulang bacaan/videomu dengan suara sendiri + rekam dan dengarkan lagi.",
    items: [
      "300 kata B2 pertama",
      "Tiap hari: ceritakan ulang 1 hal (bacaan, video, kejadian) dalam English, 2–3 menit, direkam",
      "Dengarkan rekaman sendiri — catat 3 hal yang mau diperbaiki besok",
      "Mulai latihan soal reading ala TOEFL 2x seminggu",
    ],
  },
  {
    n: 6,
    label: "Bulan 6 · Apr 2027",
    phase: "Fase 3 — Fluency + Tes",
    title: "Simulasi tes beasiswa",
    focus:
      "300 kata B2 lanjutan + mock test beasiswa ala TOEFL (reading, structure, listening) + review semua yang bolong.",
    items: [
      "300 kata B2 berikutnya",
      "1x mock test penuh per minggu: reading, structure, listening — catat skor dan pola salah",
      "Perbaiki pola salah yang berulang (mis. selalu salah di inference questions)",
      "Speaking: simulasi perkenalan + jawab pertanyaan umum beasiswa dalam English",
    ],
  },
];

const PHASES = [
  {
    name: "Fase 1 — Fondasi",
    months: "Bulan 1–2",
    desc: "1000 kata A1–A2, 6 tenses inti sebagai pola, phonetics (bisa baca IPA), shadowing 5 menit/hari. Keluar dari fase ini: berani bunyi dan paham kalimat sederhana.",
  },
  {
    name: "Fase 2 — Ekspansi",
    months: "Bulan 3–4",
    desc: "Kata B1, baca artikel dan buku English, listening harian. Keluar dari fase ini: bisa baca teks nyata tanpa terjemah per kata.",
  },
  {
    name: "Fase 3 — Fluency + Tes",
    months: "Bulan 5–6",
    desc: "Kata B2, speaking tanpa naskah (cerita ulang + rekam), mock test beasiswa ala TOEFL: reading, structure, listening.",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const m = MONTHS[active];

  return (
    <>
      <section className="hero">
        <span className="kicker">Rencana personal · 6 bulan</span>
        <h1>English Comeback</h1>
        <p className="lede">
          November 2026 sampai April 2027. Bukan kursus kilat — ini rencana
          harian kecil yang konsisten: kosakata dulu, telinga dan mulut dulu,
          grammar sebagai pola, dan tes beasiswa sebagai garis finis.
        </p>
      </section>

      <h2>Tiga fase</h2>
      <div className="grid-3">
        {PHASES.map((p) => (
          <div className="card" key={p.name}>
            <span className="phase-tag">{p.months}</span>
            <h3>{p.name}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <h2>Per bulan — pilih untuk lihat fokusnya</h2>
      <div className="tabs" role="tablist">
        {MONTHS.map((x, i) => (
          <button
            key={x.n}
            role="tab"
            aria-selected={i === active}
            className={`tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {x.n}
          </button>
        ))}
      </div>

      <div className="card">
        <span className="phase-tag">{m.phase}</span>
        <h3>
          {m.label} — {m.title}
        </h3>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>{m.focus}</p>
        <ul className="checklist">
          {m.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>

      <h2>Aturan mainnya</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Belajar = usaha, bukan hiburan</h3>
          <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>
            Deklarasikan tiap sesi: 75 menit ini belajar. Kalau berasa gampang
            dan fun terus, kemungkinan kamu lagi konsumsi, bukan latihan.
            Boring itu sinyal bener.
          </p>
        </div>
        <div className="card">
          <h3>Retrieval, bukan baca ulang</h3>
          <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>
            Setelah baca materi, tutup dan tulis ulang dari ingatan. Nulis 5
            kalimat sendiri &gt; baca 50 contoh kalimat.
          </p>
        </div>
      </div>
    </>
  );
}
