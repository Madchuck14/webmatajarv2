// Runner Python interaktif pakai Pyodide (WebAssembly), jalan langsung di browser
// siswa — tanpa server. Satu instance Pyodide dipakai bareng oleh semua runner
// di halaman (lazy-load pas tombol "Run" pertama diklik).

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

let pyodideLoadPromise = null;

function loadPyodideScript() {
  if (window.loadPyodide) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PYODIDE_CDN;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function getPyodide() {
  if (!pyodideLoadPromise) {
    pyodideLoadPromise = loadPyodideScript().then(() => window.loadPyodide());
  }
  return pyodideLoadPromise;
}

// container: elemen DOM tempat runner dipasang.
// options: { title, code }
function mountCodeRunner(container, { title, code }) {
  container.classList.add("code-runner");
  container.innerHTML = `
    <div class="code-runner__header">
      <span class="code-runner__title">${title}</span>
      <button type="button" class="code-runner__run" data-run>&#9654; Run</button>
    </div>
    <textarea class="code-runner__editor" data-editor spellcheck="false">${code}</textarea>
    <div class="code-runner__output" data-output>
      <span class="code-runner__output-placeholder">Klik "Run" untuk menjalankan kode ini.</span>
    </div>
  `;

  const runBtn = container.querySelector("[data-run]");
  const editor = container.querySelector("[data-editor]");
  const output = container.querySelector("[data-output]");

  // Tab -> insert 4 spasi, biar gak pindah fokus keluar textarea.
  editor.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0, start) + "    " + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
  });

  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    runBtn.textContent = "Menyiapkan Python…";
    output.textContent = "";
    output.classList.remove("has-error");

    try {
      const pyodide = await getPyodide();
      runBtn.textContent = "Menjalankan…";

      let buffer = "";
      pyodide.setStdout({ batched: (s) => { buffer += s + "\n"; } });
      pyodide.setStderr({ batched: (s) => { buffer += s + "\n"; } });

      await pyodide.runPythonAsync(editor.value);

      output.textContent = buffer || "(tidak ada output)";
    } catch (err) {
      output.textContent = String(err);
      output.classList.add("has-error");
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "▶ Run";
    }
  });
}
