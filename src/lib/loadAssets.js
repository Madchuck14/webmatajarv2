// Peta aset landing page. Nama file di src/assets/images/** jadi key.

const coverBabModules = import.meta.glob("/src/assets/images/cvrbabmateri/*", {
  eager: true,
  import: "default",
});
const logoModules = import.meta.glob("/src/assets/images/logoheader/*", {
  eager: true,
  import: "default",
});
const maskotModules = import.meta.glob("/src/assets/images/maskot/*", {
  eager: true,
  import: "default",
});
const bookCoverModules = import.meta.glob("/src/assets/images/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});

function toNameMap(modules) {
  const map = {};
  for (const [path, url] of Object.entries(modules)) {
    const name = path.split("/").pop();
    map[name] = url;
  }
  return map;
}

export const coverBab = toNameMap(coverBabModules); // { "bab1.png": url, ... }
export const logo = toNameMap(logoModules); // { "Logo-Penerbit-Erlangga.png": url, "saranaguru_icon_fix.png": url }
export const maskot = toNameMap(maskotModules); // { "maskot.png", "maskot3.png", "maskot4.png", "ikon2.png" }
export const bookCovers = toNameMap(bookCoverModules); // { "Matematika SMA Kelas 1.png": url, ... }
