import { CODE_PARAM, STORAGE_KEY } from "../config.js";
import { isInAppBrowser } from "./inAppBrowser.js";

// Az oldal betöltésekor (egyszer) kiolvassuk a ?k=KÓD paramétert – ez az, amikor a játékos
// a telefon saját kamerájával olvas be egy állomás QR-kódját –, majd letisztítjuk a címsort.
// A ?reset paraméter törli a mentett játékállást (szervezői teszteléshez).
function read() {
  if (typeof window === "undefined" || isInAppBrowser()) return null; // in-app: a linket másolni kell, ne bántsuk
  const url = new URL(window.location.href);
  const code = url.searchParams.get(CODE_PARAM);
  const reset = url.searchParams.has("reset");
  if (reset) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  if (code || reset) {
    url.searchParams.delete(CODE_PARAM);
    url.searchParams.delete("reset");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  return reset ? null : code;
}

export const INITIAL_CODE = read();
