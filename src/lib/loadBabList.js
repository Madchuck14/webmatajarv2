// Muat manifest.json tiap bab dari /content, urut sesuai field "urutan".

const manifestModules = import.meta.glob("/content/*/manifest.json", {
  eager: true,
});

export function loadBabList() {
  return Object.entries(manifestModules)
    .map(([path, mod]) => {
      const folder = path.split("/")[2]; // /content/<folder>/manifest.json
      return { ...mod.default, folder };
    })
    .sort((a, b) => a.urutan - b.urutan);
}
