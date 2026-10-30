import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Comeback — Rencana 6 Bulan",
  description:
    "Rencana belajar Bahasa Inggris 6 bulan: roadmap, 3000 kosakata Oxford, kamus dengan audio, tata bahasa inti, dan ritual harian.",
};

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/kosakata", label: "Kosakata" },
  { href: "/kamus", label: "Kamus" },
  { href: "/tata-bahasa", label: "Tata Bahasa" },
  { href: "/ritual", label: "Ritual" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <nav className="site-nav">
          <div className="container">
            <Link href="/" className="brand">
              English <span>Comeback</span>
            </Link>
            {NAV.slice(1).map((n) => (
              <Link key={n.href} href={n.href} className="nav-link">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <main>
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container">
            Rencana personal 6 bulan — Nov 2026 sampai Apr 2027. Data kata: Oxford
            3000. Audio &amp; definisi: dictionaryapi.dev (gratis).
          </div>
        </footer>
      </body>
    </html>
  );
}
