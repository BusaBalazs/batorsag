# Bátorságpróba – React + Vite + Tailwind + GSAP

Harry Potter témájú, QR-kódos szabadtéri játék (mobil-first).

**Játékmenet:** Nyitó oldal (szabályok) → Visszaszámláló → Start → Bevezető történet (diák) → Térkép (jelölt állomás) → QR-kód beolvasása → az állomás játéka (kvíz vagy más) → következő állomás … → Befejezés.

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
| Melyik állomás milyen játék (kvíz / saját játék) | `src/games/index.js` |
| Kvízkérdések az állomásokhoz | `src/data/questions.js` |
| Bevezető történet (diák) | `src/data/story.js` |
| Szöveges állomás (2.), végső állomás (14.), végső kvíz | `src/data/stationTexts.js`, `src/data/finale.js`, `src/data/finalQuiz.js` |
| Bájitalfőzés recept és sorrend | `src/data/potion.js` |
| Állomások és jelölőik helye a térképen | `src/data/stations.js` |
| Zoom (min/max/induló/lépés %), 3 mp-es zár, kezdési idő, cikeszjáték értékei | `src/config.js` |
| Nyitó oldal szövege | `src/content.js` |
| Térkép / háttér / plakát képek | `src/assets/` |

**Végső állomás:** a `stations.js`-ben a `final: true` jelölésű állomás minden játékosnak utoljára jön, a többi sorrendje véletlenszerű.

**Új állomás:** egy új sor a `stations.js`-ben + a játéka a `games/index.js`-ben (kvíz esetén egy kérdés a `questions.js`-ben is, azonos `id` / `stationId`). A játék a lista hosszához igazodik (haladássáv, véletlen sorrend, befejezés). Ha az állomáslista változik, a játékosok mentett állása nullázódik.

## QR-kódok
A kilenc állomás QR-kódjának tartalma egyszerűen az állomás száma: `1`–`9`. A nyomtatható kódok listája:
```bash
node scripts/print-codes.mjs
```
A számokat kódold QR-kóddá (a QR tartalma csak a szám legyen), majd olvasd be őket a játékon belüli „QR-kód beolvasása” gombbal. A beépített kamerás olvasó a `qr-scanner` csomagot használja. A játék az aktuálisan keresett állomás számával veti össze a beolvasott számot; hibás kód esetén figyelmeztet.

## Működés röviden
- **Véletlen sorrend:** minden játékos saját, véletlenszerű állomás-sorrendet kap, ami a `localStorage`-ba mentődik (`batorsagproba:v2`), a játékállással együtt. Újratöltés után ugyanott folytatódik (több fül között is szinkronban marad).
- **Beágyazott böngésző védelem:** Facebook/Instagram/TikTok/Google app/WebView stb. esetén figyelmeztető oldal jelenik meg „Link másolása” gombbal.
- **Szervezői teszt:** `?reset` az URL végén törli a mentett játékállást.

## Játékok (`src/games/`)
Minden állomáson egy játék-komponens töltődik be, miután a játékos a jó QR-kódot beolvasta. A komponens két propot kap: `station` és `onComplete` – sikeres teljesítéskor az `onComplete()`-et kell meghívni.
- `QuizGame` – kérdés + 3 válasz (a kérdések a `src/data/questions.js`-ben)
- `SnitchGame` – cikeszvadászat minijáték a 7. állomáson (a beállításai: `SNITCH_GAME` a `src/config.js`-ben – elkapandó cikeszek száma, cikesz- és körsebesség, körök száma)
- `SpiralGame` – varázsspirál minijáték a 6. állomáson: az ujjal végig kell követni a spirált, a varázspálca a kötött pályán halad (Canvas 2D + Pointer Events; a spirál előre kiszámolt útvonala a `src/games/spiralPath.js`-ben van; beállítás: `SPIRAL_GAME` a `src/config.js`-ben – tűrés és teljesítési %)
- `TextGame` – szöveges állomás „tovább megyek” gombbal és megerősítő ablakkal (2. állomás)
- `PotionGame` – bájitalfőzés a 8. állomáson: a verses recept után az üvegcséket a recept sorrendjében kell az üstbe dobni; rossz sorrendnél elölről kezdődik
- `FinalGame` – a 14. állomás: megfejtés beírása, siker-szöveg, majd 10 kérdéses végső kvíz (QR nélkül)
- `PlaceholderGame` – ideiglenes: „n. állomás játéka” + „Sikeres játékteljesítés” gomb

## Teszt gomb
Fejlesztői módban (`npm run dev`) a térképen/játékban egy szaggatott szélű **TESZT** gomb látszik: QR-kód beolvasása nélkül, asztali gépen is végig lehet vele próbálni az appot (a térképen a helyes QR beolvasását, játék közben az állomás teljesítését szimulálja). Éles buildben csak akkor jelenik meg, ha a `.env`-ben `VITE_SHOW_TEST_BUTTON=true` szerepel – élesben ne legyen bekapcsolva.
