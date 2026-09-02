// Relay progress modul bab (iframe) -> container webmatajarv2, lihat spec 2.3.

export function onBabMessage(iframeWindow, handler) {
  window.addEventListener("message", (event) => {
    if (event.source !== iframeWindow) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    handler(data);
  });
}

export function goToSlide(iframeWindow, slide) {
  iframeWindow.postMessage({ type: "goToSlide", slide }, "*");
}
