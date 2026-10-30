const STEPS: { time: string; title: string; desc: string }[] = [
  {
    time: "10 menit",
    title: "Review kemarin (recall)",
    desc: "Tutup semua catatan. Tulis dari ingatan: 10 kata kemarin + artinya. Yang lupa masuk daftar hari ini lagi.",
  },
  {
    time: "20 menit",
    title: "10 kata baru",
    desc: "Ambil dari '10 kata hari ini' di halaman Kosakata. Per kata: dengarkan → tirukan 3x dengan suara keluar → tulis 1 kalimat.",
  },
  {
    time: "15 menit",
    title: "Baca 1 bacaan English",
    desc: "Artikel pendek, dokumentasi teknis, atau 10–15 halaman buku. Tandai maksimal 5 kata/frasa baru — masukkan ke daftar besok.",
  },
  {
    time: "15 menit",
    title: "1 pola grammar",
    desc: "Satu tense atau satu pola kalimat per minggu dari halaman Tata Bahasa. Bikin 5 kalimat sendiri, ucapkan semuanya.",
  },
  {
    time: "10 menit",
    title: "Shadowing",
    desc: "Putar audio English (podcast/video), jeda tiap kalimat, tirukan intonasi dan ritmenya sepresisi mungkin.",
  },
  {
    time: "5 menit",
    title: "Jurnal 3 kalimat",
    desc: "Tulis 3 kalimat English tentang harimu. Tidak usah sempurna — yang penting keluar.",
  },
];

export default function Ritual() {
  return (
    <>
      <h1>Ritual Harian</h1>
      <p className="lede">
        Total 75 menit. Urutannya penting: mulai dari recall (mengeluarkan),
        bukan dari baca ulang (memasukkan). Konsumsi tanpa retrieval = hiburan
        berlabel belajar.
      </p>

      {STEPS.map((s, i) => (
        <div className="card" key={i}>
          <div className="step">
            <div className="step-num">{i + 1}</div>
            <div>
              <span className="time-badge">{s.time}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        </div>
      ))}

      <h2>Setelah konsumsi materi apa pun</h2>
      <div className="card">
        <ul className="checklist">
          <li>
            <strong>Recall:</strong> tutup materinya, tulis ulang poin-poinnya
            dari ingatan.
          </li>
          <li>
            <strong>Tulis 5 kalimat:</strong> pakai kata/pola yang baru
            dipelajari, tentang hidupmu sendiri.
          </li>
          <li>
            <strong>Rekam suaramu:</strong> bacakan 5 kalimat itu, dengarkan
            lagi, catat 2 hal yang mau diperbaiki.
          </li>
          <li>
            <strong>Jadwalkan pengulangan:</strong> yang belum nempel masuk ke
            review besok pagi (10 menit pertama).
          </li>
        </ul>
      </div>

      <div className="note">
        <strong>Pengingat WhatsApp:</strong> reminder kosakata tiap pagi jam
        08:00 WIB akan dipasang terpisah (jadwal otomatis ke WhatsApp) — halaman
        ini fokus ke apa yang kamu kerjakan setelah reminder itu datang.
      </div>
    </>
  );
}
