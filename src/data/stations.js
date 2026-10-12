// ─────────────────────────────────────────────────────────────
//  ÁLLOMÁSOK – ide vedd fel a QR-kódokat és a térképes helyüket
// ─────────────────────────────────────────────────────────────
//  id    – egyedi szám (a kérdések ide kapcsolódnak: questions.js → stationId)
//  code  – az állomás QR-kódjának nyers tartalma (az állomás száma, 1–9)
//  name  – csak neked, a játékos nem látja
//  map   – a jelölő helye a térképen, a kép szélességének/magasságának %-ában
//          (x: 0 = bal szél, 100 = jobb szél; y: 0 = teteje, 100 = alja)
//
//  Új állomás: vegyél fel ide egy új sort + egy kérdést a questions.js-ben.
//  A játék automatikusan az itt lévő állomások számához igazodik.
//  Figyelem: ha az állomások listája megváltozik, a játékosok mentett állása nullázódik.
// ─────────────────────────────────────────────────────────────

export const stations = [
  { id: 1, code: "1", name: "Kastély játszótér", map: { x: 17.6, y: 50.0 } },
  { id: 2, code: "2", name: "Sátortető", map: { x: 31.5, y: 39.7 } },
  { id: 3, code: "3", name: "Filagória", map: { x: 40.9, y: 20.8 } },
  { id: 4, code: "4", name: "Csillagos pálya", map: { x: 57.9, y: 25.4 } },
  { id: 5, code: "5", name: "Színes pálya", map: { x: 75.5, y: 39.7 } },
  { id: 6, code: "6", name: "Kerek pavilon", map: { x: 72.5, y: 66.4 } },
  { id: 7, code: "7", name: "Fénylő fa", map: { x: 31.5, y: 29.3 } },
  { id: 8, code: "8", name: "Alsó nagy fa", map: { x: 46.9, y: 76.8 } },
  { id: 9, code: "9", name: "Jobb alsó játszó", map: { x: 82.8, y: 80.7 } },
];
