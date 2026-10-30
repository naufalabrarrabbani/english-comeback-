"use client";

import { speak } from "@/components/speak";

const PARTS: { en: string; id: string; desc: string; ex: string }[] = [
  { en: "noun", id: "kata benda", desc: "Orang, tempat, benda, atau ide.", ex: "book, Jakarta, happiness" },
  { en: "verb", id: "kata kerja", desc: "Aksi atau keadaan.", ex: "run, eat, become" },
  { en: "adjective", id: "kata sifat", desc: "Menjelaskan noun.", ex: "happy, tall, difficult" },
  { en: "adverb", id: "kata keterangan", desc: "Menjelaskan verb, adjective, atau adverb lain.", ex: "quickly, very, well" },
  { en: "pronoun", id: "kata ganti", desc: "Pengganti noun.", ex: "I, they, herself" },
  { en: "preposition", id: "kata depan", desc: "Menunjukkan hubungan tempat, waktu, arah.", ex: "in, on, at, with" },
  { en: "conjunction", id: "kata sambung", desc: "Menghubungkan kata, frasa, atau kalimat.", ex: "and, but, because" },
  { en: "interjection", id: "kata seru", desc: "Ekspresi spontan.", ex: "wow!, oh!, hey!" },
];

const TENSES: { name: string; formula: string; example: string; note: string }[] = [
  {
    name: "Simple Present",
    formula: "S + V1 (s/es)",
    example: "She works every day.",
    note: "Kebiasaan, fakta, jadwal.",
  },
  {
    name: "Present Continuous",
    formula: "S + am/is/are + V-ing",
    example: "She is working right now.",
    note: "Sedang terjadi saat ini.",
  },
  {
    name: "Simple Past",
    formula: "S + V2",
    example: "She worked yesterday.",
    note: "Selesai di masa lalu, waktunya jelas.",
  },
  {
    name: "Past Continuous",
    formula: "S + was/were + V-ing",
    example: "She was working at 8 pm.",
    note: "Sedang terjadi di titik waktu lampau.",
  },
  {
    name: "Present Perfect",
    formula: "S + have/has + V3",
    example: "She has worked here since 2020.",
    note: "Masa lalu yang nyambung ke sekarang.",
  },
  {
    name: "Simple Future",
    formula: "S + will + V1",
    example: "She will work tomorrow.",
    note: "Rencana/keputusan masa depan.",
  },
];

export default function TataBahasa() {
  return (
    <>
      <h1>Tata Bahasa</h1>
      <p className="lede">
        Cukup dua hal: 8 jenis kata dan 6 tenses inti. Kuasai ini dulu sampai
        refleks — 12 tenses sekaligus cuma bikin pusing.
      </p>

      <h2>8 parts of speech</h2>
      <div className="pos-grid">
        {PARTS.map((p) => (
          <div className="card pos-card" key={p.en}>
            <h4>
              {p.id} <span className="en">({p.en})</span>
            </h4>
            <p>{p.desc}</p>
            <div className="ex">
              Contoh: <em>{p.ex}</em>
            </div>
          </div>
        ))}
      </div>

      <h2>6 tenses inti</h2>
      <p style={{ color: "var(--muted)" }}>
        Cara pakai halaman ini: baca formulanya, dengarkan contohnya (tombol
        suara), tirukan, lalu bikin 2 kalimatmu sendiri per tense. Satu tense
        per minggu sudah cukup.
      </p>
      {TENSES.map((t) => (
        <div className="card" key={t.name}>
          <div className="tense-head">
            <h3>{t.name}</h3>
            <button
              className="audio-btn"
              onClick={() => speak(t.example)}
              aria-label={`Dengarkan contoh ${t.name}`}
              title="Dengarkan contoh"
            >
              &#9654;
            </button>
          </div>
          <div className="formula">{t.formula}</div>
          <p style={{ margin: "8px 0 2px" }}>
            <em>&ldquo;{t.example}&rdquo;</em>
          </p>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            {t.note}
          </p>
        </div>
      ))}
    </>
  );
}
