# Bátorságpróba – React + Vite + Tailwind + GSAP

Harry Potter témájú, QR-kódos szabadtéri játék (mobil-first).

**Játékmenet:** Nyitó oldal (szabályok) → Visszaszámláló → Start → Térkép (jelölt állomás) → QR-kód beolvasása → Kvízkérdés → következő állomás … → Befejezés.

## Indítás
```bash
npm install
npm run dev      # fejlesztés
npm run build    # éles build (dist/)
```
Teszteléshez másold a `.env.example`-t `.env`-be, és állítsd be a `VITE_EVENT_START` / `VITE_SKIP_COUNTDOWN` értékét.

## Amit te szerkesztesz
| Mit | Hol |
|---|---|
| Kvízkérdések, válaszok, helyes válasz | `src/data/questions.js` |
| Állomások: QR-kód, jelölő helye a térképen | `src/data/stations.js` |
| Zoom (min/max/induló/lépés %), 3 mp-es zár, kezdési idő | `src/config.js` |
| Nyitó oldal szövege | `src/content.js` |
| Térkép / háttér / plakát képek | `src/assets/` |

**Új állomás:** egy új sor a `stations.js`-ben + egy új kérdés a `questions.js`-ben (azonos `id` / `stationId`). A játék a lista hosszához igazodik (haladássáv, véletlen sorrend, befejezés). Ha az állomáslista változik, a játékosok mentett állása nullázódik.

## QR-kódok
A kilenc állomás QR-kódjának tartalma egyszerűen az állomás száma: `1`–`9`. A nyomtatható kódok listája:
```bash
node scripts/print-codes.mjs
```
A számokat kódold QR-kóddá (a QR tartalma csak a szám legyen), majd olvasd be őket a játékon belüli „QR-kód beolvasása” gombbal. A beépített kamerás olvasó a `qr-scanner` csomagot használja. A játék az aktuálisan keresett állomás számával veti össze a beolvasott számot; hibás kód esetén figyelmeztet.

## Működés röviden
- **Véletlen sorrend:** minden játékos saját, véletlenszerű állomás-sorrendet kap, ami a `localStorage`-ba mentődik (`batorsagproba:v1`), a játékállással együtt. Újratöltés után ugyanott folytatódik (több fül között is szinkronban marad).
- **Beágyazott böngésző védelem:** Facebook/Instagram/TikTok/Google app/WebView stb. esetén figyelmeztető oldal jelenik meg „Link másolása” gombbal.
- **Szervezői teszt:** `?reset` az URL végén törli a mentett játékállást.
