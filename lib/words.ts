import raw from "./words.json";

export type CEFR = "A1" | "A2" | "B1" | "B2";

export interface Word {
  w: string;
  pos: string;
  level: CEFR;
}

const words: Word[] = (raw as [string, string, string][]).map(
  ([w, pos, level]) => ({ w, pos, level: level as CEFR })
);

export default words;

export const LEVELS: CEFR[] = ["A1", "A2", "B1", "B2"];

export function countByLevel(): Record<CEFR, number> {
  const c: Record<CEFR, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const x of words) c[x.level]++;
  return c;
}
