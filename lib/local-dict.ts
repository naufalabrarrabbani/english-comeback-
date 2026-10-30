// Offline baked dictionary loader (client-side only).
//
// Data lives in /public/dict/part-NN.json, sharded at bake time by djb2:
//   shard = djb2(word.toLowerCase()) % DICT_SHARDS
// This file MUST use the identical function or lookups will miss
// (verified bit-for-bit against dict-bake.py).

export interface BakedDef {
  d: string;
  ex?: string;
}

export interface BakedMeaning {
  pos: string;
  defs: BakedDef[];
}

export interface BakedEntry {
  ipa?: string;
  audio?: string;
  /** Indonesian gloss (conservatively cleaned; may be absent). */
  id?: string;
  meanings?: BakedMeaning[];
  /** True when the word has no dictionary data: UI shows the TTS fallback card. */
  missing?: boolean;
}

export const DICT_SHARDS = 96;

/** djb2, 32-bit unsigned — identical to dict-bake.py. */
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function shardFile(word: string): string {
  const n = djb2(word.toLowerCase()) % DICT_SHARDS;
  return `part-${String(n).padStart(2, "0")}.json`;
}

type ShardData = Record<string, BakedEntry>;

const cache = new Map<string, ShardData | null>();
const inflight = new Map<string, Promise<ShardData | null>>();

async function loadShard(file: string): Promise<ShardData | null> {
  const hit = cache.get(file);
  if (hit !== undefined) return hit;
  let p = inflight.get(file);
  if (!p) {
    p = fetch(`/dict/${file}`)
      .then((r) => (r.ok ? (r.json() as Promise<ShardData>) : null))
      .catch(() => null);
    inflight.set(file, p);
  }
  const data = await p;
  cache.set(file, data);
  inflight.delete(file);
  return data;
}

/**
 * Local-first lookup. Returns the baked entry (possibly {missing:true}),
 * or null when the shard itself could not be loaded (caller falls back
 * to the live API).
 */
export async function lookupLocal(word: string): Promise<BakedEntry | null> {
  const key = word.toLowerCase();
  const data = await loadShard(shardFile(key));
  if (!data) return null;
  return data[key] ?? null;
}
