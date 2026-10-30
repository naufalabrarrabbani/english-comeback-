"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import words, { LEVELS, countByLevel, type CEFR, type Word } from "@/lib/words";
import { speak } from "@/components/speak";
import { lookupLocal, type BakedEntry } from "@/lib/local-dict";

type Status = "hafal" | "belajar";
const STORE_KEY = "ec-word-status";

interface DictPhonetic {
  text?: string;
  audio?: string;
}
interface DictDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
}
interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}
interface DictEntry {
  word: string;
  phonetic?: string;
  phonetics: DictPhonetic[];
  meanings: DictMeaning[];
}

function loadStatus(): Record<string, Status> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 10 kata deterministik berdasarkan tanggal, dari kata yang belum ditandai hafal. */
function dailyWords(all: Word[], status: Record<string, Status>): Word[] {
  const now = new Date();
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const pool = all.filter((w) => status[w.w] !== "hafal");
  const rnd = mulberry32(seed);
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 10);
}

function bestAudio(e: DictEntry): string | null {
  for (const p of e.phonetics) {
    if (p.audio) return p.audio;
  }
  return null;
}

// Perluasan singkatan jenis kata ke Bahasa Indonesia (untuk tampilan offline).
const POS_ID: Record<string, string> = {
  "n.": "kata benda",
  "v.": "kata kerja",
  "adj.": "kata sifat",
  "adv.": "kata keterangan",
  "prep.": "kata depan",
  "pron.": "kata ganti",
  "conj.": "kata sambung",
  "interj.": "kata seru",
  "art.": "artikel",
  "aux.": "kata kerja bantu",
  "auxiliary v.": "kata kerja bantu",
  "modal v.": "kata kerja modal",
  "phr. v.": "phrasal verb",
  "det.": "penentu",
  "num.": "angka",
  "abbr.": "singkatan",
  "exclam.": "seruan",
  "indefinite article": "artikel",
  "definite article": "artikel",
};

function posId(pos: string): string {
  return pos
    .split(",")
    .map((p) => {
      const k = p.trim().toLowerCase();
      return POS_ID[k] ? `${p.trim()} (${POS_ID[k]})` : p.trim();
    })
    .join(", ");
}

function WordModal({
  word,
  onClose,
  status,
  onMark,
}: {
  word: Word;
  onClose: () => void;
  status: Status | undefined;
  onMark: (w: string, s: Status | null) => void;
}) {
  const [entry, setEntry] = useState<DictEntry | null>(null);
  const [baked, setBaked] = useState<BakedEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // "Coba lagi" pada kartu kata-tanpa-data: lewati kamus lokal, langsung coba live fetch.
  const skipLocalRef = useRef(false);

  useEffect(() => {
    skipLocalRef.current = false;
  }, [word.w]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    setEntry(null);
    setBaked(null);
    (async () => {
      // 1) Kamus offline dulu — tanpa internet pun kartu tetap tampil.
      if (!skipLocalRef.current) {
        const b = await lookupLocal(word.w);
        if (!alive) return;
        if (b) {
          setBaked(b);
          setLoading(false);
          return;
        }
        // Shard gagal dimuat -> lanjut ke live fetch di bawah.
      }
      // 2) Live fetch hanya sebagai cadangan.
      try {
        const r = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
            word.w
          )}`
        );
        if (!r.ok) throw new Error("not found");
        const d = (await r.json()) as DictEntry[];
        if (alive) setEntry(d[0]);
      } catch {
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [word.w, attempt]);

  const playAudio = () => {
    const a =
      baked?.audio || (entry ? bestAudio(entry) : null);
    if (a) {
      new Audio(a).play().catch(() => speak(word.w));
      return;
    }
    speak(word.w);
  };

  const ipa =
    baked?.ipa ||
    entry?.phonetic ||
    entry?.phonetics.find((p) => p.text)?.text ||
    null;

  const retryLive = () => {
    skipLocalRef.current = true;
    setAttempt((a) => a + 1);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2>{word.w}</h2>
            <button
              className="audio-btn"
              onClick={playAudio}
              aria-label={`Dengarkan pengucapan ${word.w}`}
              title="Dengarkan"
            >
              &#9654;
            </button>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            &#10005;
          </button>
        </div>
        <div style={{ marginTop: 6 }}>
          <span className={`level ${word.level}`}>{word.level}</span>{" "}
          <span className="pos" style={{ color: "var(--faint)", fontStyle: "italic", fontSize: 14 }}>
            {word.pos}
          </span>
        </div>
        {ipa && <div className="ipa">{ipa}</div>}

        {loading && <div className="loading">Mengambil definisi…</div>}

        {baked && !baked.missing && baked.id && (
          <div className="id-gloss">
            Arti: <strong>{baked.id}</strong>
          </div>
        )}
        {baked &&
          !baked.missing &&
          baked.meanings?.slice(0, 3).map((m, i) => (
            <div className="def" key={i}>
              <div className="pos-label">{m.pos}</div>
              <ol>
                {m.defs.slice(0, 2).map((d, j) => (
                  <li key={j}>
                    {d.d}
                    {d.ex && (
                      <span className="example">&ldquo;{d.ex}&rdquo;</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}

        {baked && baked.missing && !entry && !failed && (
          <div className="error-box">
            <div>
              Definisi kata ini belum tersedia di kamus offline. Jenis
              katanya: <em>{posId(word.pos)}</em> ({word.level}).
            </div>
            {baked.id && (
              <div style={{ marginTop: 6 }}>
                Arti: <strong>{baked.id}</strong>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              Tombol &#9654; di atas tetap bisa dipakai untuk dengar
              pengucapannya (suara perangkat).
            </div>
            <button
              className="btn small"
              style={{ marginTop: 10 }}
              onClick={retryLive}
            >
              Coba lagi
            </button>
          </div>
        )}

        {failed && (
          <div className="error-box">
            <div>
              Definisi online tidak ketemu untuk kata ini (atau koneksi
              bermasalah). Arti dasarnya: <em>{posId(word.pos)}</em> — atau
              cari manual di halaman Kamus.
            </div>
            <div style={{ marginTop: 8 }}>
              Tombol &#9654; di atas tetap bisa dipakai untuk dengar
              pengucapannya (suara perangkat).
            </div>
            <button
              className="btn small"
              style={{ marginTop: 10 }}
              onClick={() => setAttempt((a) => a + 1)}
            >
              Coba lagi
            </button>
          </div>
        )}
        {entry &&
          entry.meanings.slice(0, 3).map((m, i) => (
            <div className="def" key={i}>
              <div className="pos-label">{m.partOfSpeech}</div>
              <ol>
                {m.definitions.slice(0, 3).map((d, j) => (
                  <li key={j}>
                    {d.definition}
                    {d.example && (
                      <span className="example">&ldquo;{d.example}&rdquo;</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}

        <div className="mark-row">
          <button
            className={`btn small${status === "belajar" ? "" : " ghost"}`}
            onClick={() => onMark(word.w, status === "belajar" ? null : "belajar")}
          >
            {status === "belajar" ? "✓ Lagi dipelajari" : "Tandai lagi dipelajari"}
          </button>
          <button
            className={`btn small${status === "hafal" ? "" : " ghost"}`}
            onClick={() => onMark(word.w, status === "hafal" ? null : "hafal")}
          >
            {status === "hafal" ? "✓ Sudah hafal" : "Tandai sudah hafal"}
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE = 120;

export default function Kosakata() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<CEFR | "ALL">("ALL");
  const [visible, setVisible] = useState(PAGE);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [selected, setSelected] = useState<Word | null>(null);
  const [dailyMode, setDailyMode] = useState(false);

  useEffect(() => {
    setStatus(loadStatus());
  }, []);

  const counts = useMemo(() => countByLevel(), []);

  const mark = (w: string, s: Status | null) => {
    setStatus((prev) => {
      const next = { ...prev };
      if (s) next[w] = s;
      else delete next[w];
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  const daily = useMemo(
    () => (dailyMode ? dailyWords(words, status) : []),
    [dailyMode, status]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter(
      (w) =>
        (level === "ALL" || w.level === level) &&
        (q === "" || w.w.toLowerCase().includes(q))
    );
  }, [query, level]);

  const shown = dailyMode ? daily : filtered.slice(0, visible);
  const hafalCount = useMemo(
    () => Object.values(status).filter((s) => s === "hafal").length,
    [status]
  );

  return (
    <>
      <h1>Kosakata</h1>
      <p className="lede">
        2.868 kata Oxford 3000 + level CEFR. Klik kata untuk buka kartunya:
        cara baca (IPA), audio, definisi, contoh. Tandai progresmu — tersimpan
        di browser ini. Sudah hafal: <strong>{hafalCount}</strong> kata.
      </p>

      <div className="toolbar">
        <button
          className={`btn${dailyMode ? "" : " ghost"}`}
          onClick={() => setDailyMode(!dailyMode)}
        >
          {dailyMode ? "✓ " : ""}10 kata hari ini
        </button>
      </div>

      {!dailyMode && (
        <div className="toolbar">
          <input
            className="search"
            placeholder="Cari kata… (mis. abandon)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE);
            }}
          />
        </div>
      )}
      {!dailyMode && (
        <div className="toolbar">
          <button
            className={`chip${level === "ALL" ? " active" : ""}`}
            onClick={() => {
              setLevel("ALL");
              setVisible(PAGE);
            }}
          >
            Semua ({words.length})
          </button>
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`chip${level === l ? " active" : ""}`}
              onClick={() => {
                setLevel(l);
                setVisible(PAGE);
              }}
            >
              {l} ({counts[l]})
            </button>
          ))}
        </div>
      )}

      {dailyMode && (
        <p className="count-note">
          10 kata hari ini (ditentukan tanggal, diambil dari kata yang belum
          kamu tandai hafal). Ritual per kata: dengarkan → tirukan 3x → tulis 1
          kalimat.
        </p>
      )}
      {!dailyMode && (
        <p className="count-note">
          Menampilkan {shown.length} dari {filtered.length} kata
          {query && (
            <>
              {" "}
              untuk &ldquo;{query}&rdquo;
            </>
          )}
          .
        </p>
      )}

      <div>
        {shown.map((w) => (
          <button key={w.w} className="word-row" onClick={() => setSelected(w)}>
            <span className={`level ${w.level}`}>{w.level}</span>
            <span className="w">{w.w}</span>
            <span className="pos">{w.pos}</span>
            <span className="spacer" />
            {status[w.w] === "hafal" && (
              <span className="status-dot hafal">hafal</span>
            )}
            {status[w.w] === "belajar" && (
              <span className="status-dot belajar">belajar</span>
            )}
          </button>
        ))}
      </div>

      {!dailyMode && filtered.length > visible && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="btn ghost" onClick={() => setVisible(visible + PAGE)}>
            Tampilkan lebih banyak
          </button>
        </div>
      )}

      {selected && (
        <WordModal
          word={selected}
          onClose={() => setSelected(null)}
          status={status[selected.w]}
          onMark={mark}
        />
      )}
    </>
  );
}
