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
  minPercent: 40,
  maxPercent: 300,
  initialPercent: 100,
  stepPercent: 30,
};

// Rossz válasz után ennyi ideig látszik a piros háttér, és ennyi ideig nem lehet újra próbálkozni.
export const WRONG_ANSWER_LOCK_MS = 3000;

// Jó válasz után ennyi ideig látszik az ünneplés, mielőtt visszatér a térkép.
export const CORRECT_ANSWER_DELAY_MS = 1700;

// A QR-kódban lévő link paramétere: https://.../?k=KÓD
export const CODE_PARAM = "k";

// localStorage kulcs (a mentett sorrend és játékállás)
export const STORAGE_KEY = "batorsagproba:v1";
