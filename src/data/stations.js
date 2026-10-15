// ─────────────────────────────────────────────────────────────
//  ÁLLOMÁSOK – az állomások listája és a jelölőik helye a térképen
// ─────────────────────────────────────────────────────────────
//  id     – az állomás száma. EZ A QR-KÓD TARTALMA IS: az 1-es állomás QR-kódjában az "1" áll.
//  name   – csak neked, a játékos nem látja
//  map    – a jelölő helye a térképen, a kép szélességének/magasságának %-ában
//           (x: 0 = bal szél, 100 = jobb szél; y: 0 = teteje, 100 = alja)
//  final  – (opcionális) true: ez a játékosok VÉGSŐ állomása. Minden játékosnak ez jön utoljára,
//           a többi állomás sorrendje játékosonként véletlenszerű.
//
//  Hogy melyik állomás milyen játék, azt a src/games/index.js-ben állítod be.
//  Új állomás: vegyél fel ide egy új sort (a végső állomás sorát hagyd a lista végén),
//  és add meg a játékát a src/games/index.js-ben. A játék az itt lévő állomások számához igazodik.
//  Figyelem: ha az állomások listája megváltozik, a játékosok mentett állása nullázódik.
// ─────────────────────────────────────────────────────────────

export const stations = [
  { id: 1, name: "Vágány", map: { x: 40, y: 60 } },
  { id: 2, name: "Szemüveg", map: { x: 36, y: 37 } },
  { id: 3, name: "Kviddics", map: { x: 41, y: 30 } },
  { id: 4, name: "Edevis tükre", map: { x: 23, y: 55.0 } },
  { id: 5, name: "Ron", map: { x: 50.0, y: 80.0 } },
  // { id: 6, name: "Kerek pavilon", map: { x: 29.8, y: 63.5 } },
  { id: 7, name: "Sakk", map: { x: 52, y: 32.0 } },
  // { id: 8, name: "Parkoló", map: { x: 62, y: 41.0 } },
  // { id: 9, name: "Kis házikó", map: { x: 60.7, y: 30.6 } },
  // { id: 10, name: "Büfé", map: { x: 73, y: 38 } },
  // { id: 11, name: "Felső pavilon", map: { x: 77.8, y: 18.4 } },
  // { id: 12, name: "Pokrócos rét", map: { x: 79.4, y: 29.3 } },
  { id: 13, name: "Fény", map: { x: 39, y: 18 } },
  { id: 14, name: "Végső állomás", final: true, map: { x: 33.9, y: 78.6 } },
];
