// Browser speech synthesis helper (client-side only).
export function speak(text: string, lang = "en-US", rate = 0.9): void {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  synth.speak(u);
}
