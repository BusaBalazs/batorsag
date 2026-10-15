// ─────────────────────────────────────────────────────────────
//  BÁJITALFŐZÉS (8. állomás) – a recept és a hozzávalók sorrendje, szerkeszthető
// ─────────────────────────────────────────────────────────────
//  poem   – a vers, páros sorokra bontva (egy lista = egy versszak-pár)
//  order  – az üvegcsék helyes sorrendje: "yellow" (sárga), "blue" (kék), "green" (zöld), "lilac" (lila)
//           Ha a verset átírod, ezt a sorrendet is igazítsd hozzá!
// ─────────────────────────────────────────────────────────────

export const POTION_RECIPE = {
  title: "A bájital receptje",
  poem: [
    ["Ha a varázserőd ma próbára tennéd,", "Ezt a bájitalt most gondosan keverd szét!"],
    ["Először a sárga holdkőpor szálljon,", "Hogy a láng a feneborban fellobbanjon lágyan."],
    ["Utána a kék üröm esszenciája jöjjön,", "Hogy a füst a sötét boltívek közt feltűnjön."],
    ["Harmadikként a zöld aszalt füge teremjen,", "Melytől a varázs az üstben életre kel rendesen."],
    ["S a végén a lila bumszalagbőr porladjon –", "Így nyílik meg az út a titkos határon!"],
  ],
  howTo:
    "Olvasd el figyelmesen a receptet, és jegyezd meg a hozzávalók sorrendjét! Ha készen állsz, nyomd meg a gombot: előbukkan az üst és a négy üvegcse. Húzd az üvegcséket az üstbe a recept szerinti sorrendben (egy koppintás is elég). Ha rossz üvegcsét teszel be, a főzet elromlik, és előlről kell kezdened.",
  startButton: "Elkészítem a főzetet",
  order: ["yellow", "blue", "green", "lilac"],
};
