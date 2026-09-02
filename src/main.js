import { renderBabList } from "./layers/BabList.js";
import { renderPptViewer } from "./layers/PptViewer.js";
import { getBukuIdFromQuery, onParentCommand } from "./lib/parentBridge.js";
import { loadBabList } from "./lib/loadBabList.js";

const app = document.getElementById("app");
const bukuId = getBukuIdFromQuery();
console.log("bukuId dari Saranaguru:", bukuId);

function showBabList() {
  window.location.hash = "";
  renderBabList(app, { onOpenBab: (bab) => showPptViewer(bab) });
}

function showPptViewer(bab) {
  window.location.hash = `#${bab.babId}`;
  renderPptViewer(app, {
    bab,
    onBack: showBabList,
    onOpenBab: (nextBab) => showPptViewer(nextBab),
  });
}

// Deep-link via hash, mis. #bab-3.
function routeFromHash() {
  const babId = window.location.hash.replace("#", "");
  if (!babId) {
    showBabList();
    return;
  }
  const bab = loadBabList().find((b) => b.babId === babId);
  if (bab) showPptViewer(bab);
  else showBabList();
}

onParentCommand((data) => {
  if (data.type === "goToBab") {
    const bab = loadBabList().find((b) => b.babId === data.babId);
    if (bab) showPptViewer(bab);
  }
});

routeFromHash();
