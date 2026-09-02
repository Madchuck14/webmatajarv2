// Fallback video (spec 2.4): progress berbasis waktu tonton, bukan slide.

const video = document.getElementById("babVideo");

video.addEventListener("timeupdate", () => {
  if (!video.duration) return;
  window.parent.postMessage(
    {
      type: "progress",
      slide: Math.floor(video.currentTime),
      totalSlide: Math.floor(video.duration),
    },
    "*"
  );
});

video.addEventListener("ended", () => {
  window.parent.postMessage({ type: "completed" }, "*");
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "goToSlide") return;
  video.currentTime = data.slide;
});
