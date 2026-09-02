// Bab 3 — dirender dari slides.json (hasil ekstraksi PPT asli). Slide yang
// aslinya berisi tombol "Implementasi pada program — Klik Di sini" diganti
// jadi code runner Python interaktif (Pyodide), lihat code-runner.js.

const STAGE_W = 1280;
const STAGE_H = 720;
const MEDIA_BASE = "./assets/media/";

const CODE_RUNNERS = {
  5: {
    title: "Contoh: Fungsi & Prosedur",
    code: `def sapa(nama):
    return f"Halo, {nama}!"

def tampilkan_garis():
    print("-" * 20)

tampilkan_garis()
print(sapa("Dinda"))
tampilkan_garis()
`,
  },
  9: {
    title: "Contoh: Algoritma Rekursi",
    code: `def faktorial(n):
    if n <= 1:
        return 1
    return n * faktorial(n - 1)

for i in range(1, 6):
    print(f"{i}! = {faktorial(i)}")
`,
  },
  12: {
    title: "Contoh: Efisiensi Waktu (Bubble Sort vs sorted())",
    code: `import time
import random

data = [random.randint(1, 1000) for _ in range(500)]

def bubble_sort(arr):
    arr = arr.copy()
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

start = time.time()
bubble_sort(data)
print(f"Bubble sort : {time.time() - start:.4f} detik")

start = time.time()
sorted(data)
print(f"sorted()    : {time.time() - start:.4f} detik")
`,
  },
  15: {
    title: "Contoh: Program Fungsi Kuadrat",
    code: `import math

def selesaikan_kuadrat(a, b, c):
    d = b ** 2 - 4 * a * c
    if d > 0:
        x1 = (-b + math.sqrt(d)) / (2 * a)
        x2 = (-b - math.sqrt(d)) / (2 * a)
        return f"Dua akar berbeda: x1={x1:.2f}, x2={x2:.2f}"
    elif d == 0:
        x = -b / (2 * a)
        return f"Satu akar kembar: x={x:.2f}"
    else:
        return "Akar kompleks (D < 0)"

print(selesaikan_kuadrat(1, -3, 2))
print(selesaikan_kuadrat(1, 2, 1))
print(selesaikan_kuadrat(1, 0, 1))
`,
  },
  17: {
    title: "Contoh: Aplikasi Kuis Sederhana",
    code: `soal = [
    {"pertanyaan": "Ibu kota Indonesia?", "jawaban": "jakarta"},
    {"pertanyaan": "2 + 2 = ?", "jawaban": "4"},
]

jawaban_siswa = ["jakarta", "5"]

skor = 0
for i, s in enumerate(soal):
    benar = jawaban_siswa[i].strip().lower() == s["jawaban"]
    skor += benar
    status = "Benar" if benar else "Salah"
    print(f"Soal {i+1}: {s['pertanyaan']}")
    print(f"  Jawabanmu: {jawaban_siswa[i]} -> {status}")

print(f"\\nSkor akhir: {skor}/{len(soal)}")
`,
  },
  19: {
    title: "Contoh: Program Fungsi Kuadrat",
    code: `import math

def selesaikan_kuadrat(a, b, c):
    d = b ** 2 - 4 * a * c
    if d > 0:
        x1 = (-b + math.sqrt(d)) / (2 * a)
        x2 = (-b - math.sqrt(d)) / (2 * a)
        return f"Dua akar berbeda: x1={x1:.2f}, x2={x2:.2f}"
    elif d == 0:
        x = -b / (2 * a)
        return f"Satu akar kembar: x={x:.2f}"
    else:
        return "Akar kompleks (D < 0)"

print(selesaikan_kuadrat(1, -3, 2))
`,
  },
};

function px(pct, total) {
  return (pct / 100) * total;
}

function isCodeRunnerMarker(shape) {
  if (shape.kind !== "text" || !shape.paragraphs) return false;
  const text = shape.paragraphs.map((p) => p.runs.map((r) => r.text).join("")).join("");
  return text.startsWith("Implementasi pada program");
}

function buildTextShape(shape) {
  const el = document.createElement("div");
  el.className = "shape shape-text";
  if (shape.fill && shape.fill.startsWith("#")) {
    el.style.background = shape.fill;
    el.style.alignItems = "center";
    if (shape.shape === "roundRect") el.style.borderRadius = "999px";
  }
  (shape.paragraphs || []).forEach((para) => {
    const p = document.createElement("p");
    if (para.align === "ctr") p.style.textAlign = "center";
    if (para.align === "r") p.style.textAlign = "right";
    para.runs.forEach((run) => {
      const span = document.createElement("span");
      span.textContent = run.text;
      if (run.bold) span.classList.add("bold");
      if (run.size) span.style.fontSize = `${run.size * 1.3333}px`;
      if (run.color && run.color.startsWith("#")) span.style.color = run.color;
      p.appendChild(span);
    });
    el.appendChild(p);
  });
  return el;
}

function buildImageShape(shape) {
  const img = document.createElement("img");
  img.className = "shape shape-image";
  img.src = MEDIA_BASE + shape.src;
  img.alt = "";
  img.loading = "lazy";
  return img;
}

function buildTableShape(shape) {
  const table = document.createElement("table");
  table.className = "shape shape-table";
  shape.rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}

function buildConnectorShape() {
  const el = document.createElement("div");
  el.className = "shape shape-connector";
  return el;
}

function buildCodeRunnerShape(slideIndex) {
  const el = document.createElement("div");
  el.className = "shape";
  const runnerData = CODE_RUNNERS[slideIndex];
  mountCodeRunner(el, runnerData);
  return el;
}

// Marker asli cuma sebaris teks kecil ("Klik Di sini") — code runner butuh
// ruang jauh lebih besar, jadi posisinya di-override, bukan dipakai apa adanya.
const CODE_RUNNER_GEOM = { xPct: 5, yPct: 30, wPct: 90, hPct: 66 };

function applyGeom(el, geom) {
  if (!geom) return;
  el.style.left = `${px(geom.xPct, STAGE_W)}px`;
  el.style.top = `${px(geom.yPct, STAGE_H)}px`;
  el.style.width = `${px(geom.wPct, STAGE_W)}px`;
  el.style.height = `${px(geom.hPct, STAGE_H)}px`;
}

function autoFitText(el) {
  const hasExplicitSize = el.querySelector("span[style*='font-size']");
  if (hasExplicitSize) return;
  let size = Math.min(parseFloat(el.style.height) * 0.42, 28);
  el.style.fontSize = `${size}px`;
  let guard = 40;
  while (el.scrollHeight > el.clientHeight + 1 && size > 10 && guard-- > 0) {
    size -= 1;
    el.style.fontSize = `${size}px`;
  }
}

function renderDividerSlide(slideData, chapterTitle) {
  const canvas = document.createElement("div");
  canvas.className = "slide-canvas is-divider";

  const titleShape = slideData.shapes.find((s) => s.divider);
  const text = titleShape
    ? titleShape.paragraphs.map((p) => p.runs.map((r) => r.text).join("")).join(" ")
    : chapterTitle;

  const title = document.createElement("div");
  title.className = "divider-title";
  title.textContent = text;
  canvas.appendChild(title);

  return canvas;
}

function renderContentSlide(slideData) {
  const canvas = document.createElement("div");
  canvas.className = "slide-canvas";

  slideData.shapes.forEach((shape) => {
    if (isCodeRunnerMarker(shape) && CODE_RUNNERS[slideData.index]) {
      const el = buildCodeRunnerShape(slideData.index);
      applyGeom(el, CODE_RUNNER_GEOM);
      canvas.appendChild(el);
      return;
    }

    let el;
    if (shape.kind === "text") el = buildTextShape(shape);
    else if (shape.kind === "image") el = buildImageShape(shape);
    else if (shape.kind === "table") el = buildTableShape(shape);
    else if (shape.kind === "connector") el = buildConnectorShape();
    else return;

    applyGeom(el, shape.geom);
    canvas.appendChild(el);
    if (shape.kind === "text") autoFitText(el);
  });

  return canvas;
}

async function boot() {
  const res = await fetch("./slides.json");
  const slides = await res.json();
  const root = document.getElementById("slides-root");

  const chapterTitle = "Algoritma dan Pemrograman";

  slides.forEach((slideData) => {
    const section = document.createElement("section");
    const isDivider = slideData.shapes.length === 0 || slideData.shapes.every((s) => s.divider);
    const canvas = isDivider
      ? renderDividerSlide(slideData, chapterTitle)
      : renderContentSlide(slideData);
    section.appendChild(canvas);
    root.appendChild(section);
  });

  const deck = new Reveal({
    width: STAGE_W,
    height: STAGE_H,
    margin: 0.02,
    hash: false,
    controls: false,
    keyboard: true,
  });

  await deck.initialize();
  animateSlide(deck.getCurrentSlide());
  reportProgress(deck);

  deck.on("slidechanged", (e) => {
    animateSlide(e.currentSlide);
    reportProgress(deck);
  });

  function animateSlide(slideEl) {
    const canvas = slideEl.querySelector(".slide-canvas");
    if (!canvas) return;
    const children = Array.from(canvas.children);
    gsap.fromTo(
      children,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "transform,opacity,willChange",
      }
    );
  }

  function reportProgress(deckInstance) {
    const slide = deckInstance.getIndices().h + 1;
    const totalSlide = deckInstance.getTotalSlides();
    window.parent.postMessage({ type: "progress", slide, totalSlide }, "*");
    if (slide === totalSlide) {
      window.parent.postMessage({ type: "completed" }, "*");
    }
  }

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "goToSlide") return;
    deck.slide(data.slide - 1);
  });
}

boot();
