// Muat manifest.json tiap bab dari /content, urut sesuai field "urutan".

const manifestModules = import.meta.glob("/public/content/*/manifest.json", {
  eager: true,
});

export function loadBabList() {
  return Object.entries(manifestModules)
    .map(([path, mod]) => {
      const folder = path.split("/")[3]; // /public/content/<folder>/manifest.json
      return { ...mod.default, folder };
    })
    .sort((a, b) => a.urutan - b.urutan);
}
