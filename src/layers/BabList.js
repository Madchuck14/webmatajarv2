import { loadBabList } from "../lib/loadBabList.js";
import { coverBab, logo, maskot, bookCovers } from "../lib/loadAssets.js";

const STATUS_LABEL = {
  belum: "Belum",
  sedang: "Sedang",
  selesai: "Selesai",
};

// progressByBab: Map<babId, { status }> — dipasok dari luar, default "belum".
export function renderBabList(container, { onOpenBab, progressByBab = {} } = {}) {
  const babList = loadBabList();
  const judulBuku = "Koding dan Kecerdasan Artifisial untuk SMA/Ma Kelas X";

  const root = document.createElement("div");
  root.className = "landing";
  root.innerHTML = `
    <div class="landing__hero-wrap">
      <header class="landing__hero">
        <div class="landing__hero-rings" aria-hidden="true">
          <span class="landing__ring landing__ring--green"></span>
          <span class="landing__ring landing__ring--blue"></span>
          <span class="landing__ring landing__ring--pink"></span>
        </div>

        <img src="${logo["saranaguru_icon_fix.png"] ?? ""}" alt="Saranaguru" class="landing__logo landing__logo--sarana" />
        <div class="landing__logo landing__logo--erlangga landing__logo-crop">
          <img src="${logo["Logo-Penerbit-Erlangga.png"] ?? ""}" alt="Penerbit Erlangga" />
        </div>

        <h1 class="landing__headline landing__headline--1">Belajar Dengan Mudah</h1>
        <h1 class="landing__headline landing__headline--2">
          Dengan Materi Ajar <span class="landing__accent-green">Interaktif</span> dari Buku
          <span class="landing__accent-pink">Terbaik</span>
        </h1>

        <svg class="landing__wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,24 L1440,60 L0,60 Z" fill="var(--color-bg)" />
        </svg>
      </header>

      <div class="landing__hero-books" aria-hidden="true">
        <div class="landing__hero-books-track">
          <div class="landing__hero-books-grid">
            <img src="${bookCovers["Bahasa-inggris-sma.png"] ?? ""}" alt="" class="landing__book-cover" />
            <img src="${bookCovers["IPA Biologi Kelas 10.png"] ?? ""}" alt="" class="landing__book-cover" />
            <img src="${bookCovers["IPA Fisika SMA Kelas 10.png"] ?? ""}" alt="" class="landing__book-cover" />
            <img src="${bookCovers["IPA KIMIA SMA Kelas 10.png"] ?? ""}" alt="" class="landing__book-cover" />
            <img src="${bookCovers["Matematika SMA Kelas 1.png"] ?? ""}" alt="" class="landing__book-cover" />
            <img src="${bookCovers["Cover depan SMA kls 10.jpg"] ?? ""}" alt="" class="landing__book-cover" />
          </div>
        </div>
      </div>
    </div>

    <section class="landing__body" aria-labelledby="course-title">
      <h2 id="course-title">${judulBuku}</h2>
      <p class="landing__subtitle">Pilih bab untuk dipelajari</p>

      <div class="bab-grid"></div>
    </section>

    <footer class="landing__maskot">
      <img src="${maskot["ikon2.png"] ?? ""}" alt="" class="landing__maskot-img" />
      <img src="${maskot["maskot.png"] ?? ""}" alt="" class="landing__maskot-img" />
      <img src="${maskot["maskot3.png"] ?? ""}" alt="" class="landing__maskot-img" />
      <img src="${maskot["maskot4.png"] ?? ""}" alt="" class="landing__maskot-img" />
    </footer>
  `;

  const grid = root.querySelector(".bab-grid");
  babList.forEach((bab) => {
    const status = progressByBab[bab.babId]?.status ?? "belum";
    const coverKey = `${bab.folder}.png`;

    const card = document.createElement("article");
    card.className = "bab-card";
    card.innerHTML = `
      <img src="${coverBab[coverKey] ?? ""}" alt="" class="bab-card__cover" />
      <div class="bab-card__body">
        <div class="bab-card__heading">
          <span class="bab-card__title">Bab ${bab.urutan}</span>
          <span class="bab-status bab-status--${status}">${STATUS_LABEL[status]}</span>
        </div>
        <p class="bab-card__topic">${bab.judul}</p>
        <button type="button" class="bab-card__btn">Pelajari</button>
      </div>
    `;
    card.querySelector(".bab-card__btn").addEventListener("click", () => onOpenBab(bab));

    grid.appendChild(card);
  });

  container.replaceChildren(root);
}
