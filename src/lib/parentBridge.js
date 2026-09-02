// Relay progress webmatajarv2 -> Saranaguru (parent), lihat spec 2.1.

export function reportProgress(slide, totalSlide) {
  window.parent.postMessage({ type: "progress", slide, totalSlide }, "*");
}

export function reportCompleted() {
  window.parent.postMessage({ type: "completed" }, "*");
}

// Terima perintah Saranaguru -> webmatajarv2 (opsional, mis. goToBab).
export function onParentCommand(handler) {
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || typeof data !== "object") return;
    handler(data);
  });
}

export function getBukuIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("buku");
}
