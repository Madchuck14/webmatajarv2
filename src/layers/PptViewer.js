import { onBabMessage, goToSlide } from "../lib/babBridge.js";
import { reportProgress, reportCompleted } from "../lib/parentBridge.js";
import { logo } from "../lib/loadAssets.js";

export function renderPptViewer(container, { bab, onBack }) {
  const root = document.createElement("div");
  root.className = "ppt-viewer";
  root.dataset.sidebarOpen = "true";

  const outlineItems = Array.from(
    { length: bab.totalSlide },
    (_, i) => `<li data-slide-index="${i}"><span class="ppt-outline__num">${String(i + 1).padStart(2, "0")}</span> Outline ${i + 1}</li>`
  ).join("");

  root.innerHTML = `
    <header class="ppt-viewer__topbar">
      <h1 class="ppt-viewer__title">${bab.judul}</h1>
      <div class="ppt-viewer__logos">
        <img src="${logo["saranaguru_icon_fix.png"] ?? ""}" alt="Saranaguru" />
        <img src="${logo["Logo-Penerbit-Erlangga.png"] ?? ""}" alt="Penerbit Erlangga" />
      </div>
    </header>

    <div class="ppt-viewer__body">
      <aside class="ppt-viewer__sidebar">
        <div class="ppt-viewer__sidebar-top">
          <button type="button" class="ppt-viewer__back" data-back>&larr; Kembali Pilih Bab</button>
        </div>

        <div class="ppt-outline">
          <h2>Outline Bab</h2>
          <ol data-outline-list>${outlineItems}</ol>
        </div>

        <div class="ppt-tracker">
          <h2>Perkembangan Belajar</h2>
          <div class="ppt-tracker__ring" data-tracker-ring style="--pct: 0">
            <span data-tracker-pct>0%</span>
          </div>
        </div>
      </aside>

      <div class="ppt-viewer__stage-wrap">
        <button type="button" class="ppt-viewer__hamburger" data-toggle-sidebar aria-label="Buka/tutup sidebar">
          <span></span><span></span><span></span>
        </button>

        <div class="viewer__stage" data-stage>
          <iframe src="/content/${bab.folder}/index.html" allow="fullscreen" allowfullscreen data-bab-frame></iframe>
          <button type="button" class="ppt-viewer__tap-zone ppt-viewer__tap-zone--prev" data-tap-prev aria-label="Slide sebelumnya"></button>
          <button type="button" class="ppt-viewer__tap-zone ppt-viewer__tap-zone--next" data-tap-next aria-label="Slide berikutnya"></button>
          <button type="button" class="ppt-viewer__fullscreen" data-fullscreen aria-label="Perbesar tampilan">
            &#x26F6;
          </button>
        </div>

        <div class="ppt-progress-linear">
          <div class="ppt-progress-linear__fill" data-progress-linear-fill style="width:0%"></div>
        </div>
      </div>
    </div>
  `;

  container.replaceChildren(root);

  root.querySelector("[data-back]").addEventListener("click", onBack);

  root.querySelector("[data-toggle-sidebar]").addEventListener("click", () => {
    root.dataset.sidebarOpen = root.dataset.sidebarOpen === "true" ? "false" : "true";
  });

  const iframe = root.querySelector("[data-bab-frame]");
  const trackerRing = root.querySelector("[data-tracker-ring]");
  const trackerPct = root.querySelector("[data-tracker-pct]");
  const progressFill = root.querySelector("[data-progress-linear-fill]");
  const outlineList = root.querySelector("[data-outline-list]");

  let current = { slide: 1, totalSlide: bab.totalSlide ?? 1 };

  onBabMessage(iframe.contentWindow, (data) => {
    if (data.type === "progress") {
      current = { slide: data.slide, totalSlide: data.totalSlide };
      const pct = Math.round((data.slide / data.totalSlide) * 100);
      trackerRing.style.setProperty("--pct", pct);
      trackerPct.textContent = `${pct}%`;
      progressFill.style.width = `${pct}%`;

      outlineList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("is-active", Number(li.dataset.slideIndex) === data.slide - 1);
      });

      reportProgress(data.slide, data.totalSlide);
    } else if (data.type === "completed") {
      reportCompleted();
    }
  });

  root.querySelector("[data-tap-prev]").addEventListener("click", () => {
    goToSlide(iframe.contentWindow, Math.max(1, current.slide - 1));
  });
  root.querySelector("[data-tap-next]").addEventListener("click", () => {
    goToSlide(iframe.contentWindow, Math.min(current.totalSlide, current.slide + 1));
  });

  outlineList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      goToSlide(iframe.contentWindow, Number(li.dataset.slideIndex) + 1);
    });
  });

  const stage = root.querySelector("[data-stage]");
  const fullscreenBtn = root.querySelector("[data-fullscreen]");

  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    const request =
      stage.requestFullscreen ||
      stage.webkitRequestFullscreen ||
      stage.msRequestFullscreen;
    request?.call(stage)?.catch?.(() => {});
  });

  document.addEventListener("fullscreenchange", () => {
    stage.classList.toggle("is-fullscreen", document.fullscreenElement === stage);
  });
}
