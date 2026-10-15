// ─────────────────────────────────────────────────────────────
//  BEÁLLÍTÁSOK – itt minden fontos érték egy helyen módosítható
// ─────────────────────────────────────────────────────────────

// A kaland kezdete (visszaszámláló). Felülírható .env-ben: VITE_EVENT_START=2026-10-31T10:00:00+01:00
export const EVENT_START =
  import.meta.env.VITE_EVENT_START ?? "2026-10-31T10:00:00+01:00";

// Teszteléshez: ha true, a Start gomb a visszaszámláló lejárta előtt is aktív.
// .env-ben: VITE_SKIP_COUNTDOWN=true  (éles változatban hagyd üresen!)
export const SKIP_COUNTDOWN = import.meta.env.VITE_SKIP_COUNTDOWN === "true";

// ── TÉRKÉP ZOOM (százalékban) ────────────────────────────────
// A 100% = a térkép kitölti a térképablak magasságát.
//   minPercent     – legkisebb nagyítás (kicsinyítés határa)
//   maxPercent     – legnagyobb nagyítás
//   initialPercent – induló nagyítás (a jelölt állomásra középre igazítva)
//   stepPercent    – a +/− gombok egy lépése
export const MAP_ZOOM = {
  minPercent: 30,
  maxPercent: 300,
  initialPercent: 100,
  stepPercent: 30,
};

// Rossz válasz után ennyi ideig látszik a piros háttér, és ennyi ideig nem lehet újra próbálkozni.
export const WRONG_ANSWER_LOCK_MS = 3000;

// Jó válasz után ennyi ideig látszik az ünneplés, mielőtt visszatér a térkép.
export const CORRECT_ANSWER_DELAY_MS = 1700;

// ── CIKESZVADÁSZAT MINIJÁTÉK (7. állomás) ───────────────────
// A sebességek képpont/másodpercben értendők: nagyobb szám = gyorsabb mozgás.
//   snitchesToCatch – ennyi cikeszt kell elkapni a teljesítéshez
//   snitchSpeed     – a cikesz sebessége
//   circleSpeed     – a piros és zöld körök sebessége
//   circleCount     – hány kör cikázik a pályán
export const SNITCH_GAME = {
  snitchesToCatch: 5,
  snitchSpeed: 300,
  circleSpeed: 180,
  circleCount: 10,
};

// ── VARÁZSSPIRÁL MINIJÁTÉK (6. állomás) ──────────────────────
//   tolerance       – milyen messze lehet az ujj a spirál vonalától, a játékmező szélességének %-ában
//                     (nagyobb szám = engedékenyebb, kisebb = pontosabb vezetés kell)
//   completePercent – hány %-nál tekintjük teljesítettnek a spirált
export const SPIRAL_GAME = {
  tolerance: 9,
  completePercent: 97,
};

// ── BÁJITALFŐZŐ MINIJÁTÉK (8. állomás) ───────────────────────
//   allowRecipeReread – ha true, a főzés közben is újra elolvasható a recept (📜 gomb);
//                       ha false, a játékosnak meg kell jegyeznie a sorrendet
export const POTION_GAME = {
  allowRecipeReread: true,
};

// ── TESZT GOMB ───────────────────────────────────────────────
// A térképen/játékban egy „TESZT” gomb jelenik meg, amivel QR-kód beolvasás nélkül, asztali gépen is végig lehet
// próbálni az appot. Fejlesztői módban (npm run dev) alapból látszik; éles buildben csak akkor, ha a .env-ben
// VITE_SHOW_TEST_BUTTON=true szerepel. Éles változatban NE legyen bekapcsolva!
export const SHOW_TEST_BUTTON =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_TEST_BUTTON === "true";

// A QR-kódban lévő link paramétere: https://.../?k=KÓD
export const CODE_PARAM = "k";

// localStorage kulcs (a mentett sorrend és játékállás). Ha a mentés szerkezete változik, emeld a verziószámot.
export const STORAGE_KEY = "batorsagproba:v3";
