"use client";

import { useState } from "react";
import { speak } from "@/components/speak";
import { lookupLocal, type BakedEntry } from "@/lib/local-dict";

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

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done"; entry: DictEntry }
  | { kind: "baked"; baked: BakedEntry; word: string };

export default function Kamus() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const lookup = async (word: string) => {
    const w = word.trim().toLowerCase();
    if (!w) return;
    setState({ kind: "loading" });
    // 1) Kamus offline dulu — kata Oxford 3000 langsung tampil tanpa internet.
    const b = await lookupLocal(w);
    if (b && !b.missing) {
      setState({ kind: "baked", baked: b, word: w });
      return;
    }
    // 2) Live fetch sebagai cadangan (kata di luar daftar / data belum ada).
    try {
      const r = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`
      );
      if (!r.ok) {
        setState({
          kind: "error",
          message: `Kata "${w}" tidak ditemukan. Cek ejaannya — atau coba kata dasarnya (mis. "running" → "run").`,
        });
        return;
      }
      const d = (await r.json()) as DictEntry[];
      setState({ kind: "done", entry: d[0] });
    } catch {
      setState({
        kind: "error",
        message:
          "Koneksi ke layanan kamus gagal. Periksa internetmu lalu coba lagi.",
      });
    }
  };

  const playAudio = (entry: DictEntry) => {
    const a = entry.phonetics.find((p) => p.audio)?.audio;
    if (a) {
      new Audio(a).play().catch(() => speak(entry.word));
    } else {
      speak(entry.word);
    }
  };

  const playBakedAudio = (b: BakedEntry, word: string) => {
    if (b.audio) {
      new Audio(b.audio).play().catch(() => speak(word));
    } else {
      speak(word);
    }
  };

  return (
    <>
      <h1>Kamus</h1>
      <p className="lede">
        Ketik kata English apa saja — dapatkan cara baca (IPA), audio, arti,
        dan contoh kalimat, ala Cambridge / Merriam-Webster.
      </p>

      <form
        className="toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          lookup(input);
        }}
      >
        <input
          className="search"
          placeholder="Ketik kata… (mis. perseverance)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn" type="submit">
          Cari
        </button>
      </form>

      {state.kind === "idle" && (
        <div className="card">
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Contoh: coba cari <em>abandon</em>, <em>perseverance</em>, atau{" "}
            <em>meticulous</em>. Setelah dapat artinya, ucapkan 3x dan tulis 1
            kalimatmu sendiri — itu yang bikin nempel.
          </p>
        </div>
      )}

      {state.kind === "loading" && <div className="loading">Mencari…</div>}

      {state.kind === "error" && (
        <div className="error-box">{state.message}</div>
      )}

      {state.kind === "baked" && (
        <div className="card">
          <h2 className="dict-headword">{state.word}</h2>
          <div className="dict-meta">
            <button
              className="audio-btn"
              onClick={() => playBakedAudio(state.baked, state.word)}
              aria-label={`Dengarkan pengucapan ${state.word}`}
              title="Dengarkan"
            >
              &#9654;
            </button>
            {state.baked.ipa && (
              <span className="ipa" style={{ margin: 0 }}>
                {state.baked.ipa}
              </span>
            )}
          </div>
          {state.baked.id && (
            <div className="id-gloss">
              Arti: <strong>{state.baked.id}</strong>
            </div>
          )}
          {state.baked.meanings?.slice(0, 4).map((m, i) => (
            <div className="def" key={i}>
              <div className="pos-label">{m.pos}</div>
              <ol>
                {m.defs.slice(0, 4).map((d, j) => (
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
          <p className="count-note">
            Ritual: baca definisinya, tutup halaman ini, tulis ulang artinya
            dari ingatan + 1 kalimat buatanmu.
          </p>
        </div>
      )}

      {state.kind === "done" && (
        <div className="card">
          <h2 className="dict-headword">{state.entry.word}</h2>
          <div className="dict-meta">
            <button
              className="audio-btn"
              onClick={() => playAudio(state.entry)}
              aria-label={`Dengarkan pengucapan ${state.entry.word}`}
              title="Dengarkan"
            >
              &#9654;
            </button>
            {(state.entry.phonetic ||
              state.entry.phonetics.find((p) => p.text)?.text) && (
              <span className="ipa" style={{ margin: 0 }}>
                {state.entry.phonetic ||
                  state.entry.phonetics.find((p) => p.text)?.text}
              </span>
            )}
          </div>
          {state.entry.meanings.slice(0, 4).map((m, i) => (
            <div className="def" key={i}>
              <div className="pos-label">{m.partOfSpeech}</div>
              <ol>
                {m.definitions.slice(0, 4).map((d, j) => (
                  <li key={j}>
                    {d.definition}
                    {d.example && (
                      <span className="example">&ldquo;{d.example}&rdquo;</span>
                    )}
                    {d.synonyms && d.synonyms.length > 0 && (
                      <div className="syn">
                        Sinonim: {d.synonyms.slice(0, 6).join(", ")}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <p className="count-note">
            Ritual: baca definisinya, tutup halaman ini, tulis ulang artinya
            dari ingatan + 1 kalimat buatanmu.
          </p>
        </div>
      )}
    </>
  );
}
