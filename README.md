# Bátorságpróba – React + Vite + Tailwind + GSAP

Két oldal:
1. **Nyitó oldal** (`LandingPage`) – 3 lenyitható `<details>` elem, alul „Elolvastam és megértettem” checkbox, ami után aktív lesz a **Belépés** gomb.
2. **Visszaszámláló oldal** (`CountdownPage`) – a teljes háttérkép látszik (arányos méretezés), a kép színeihez illő CSS `linear-gradient` háttérrel; középen visszaszámláló és inaktív **Start** gomb.

## Indítás
```bash
npm install
npm run dev      # fejlesztés
npm run build    # éles build (dist/)
```

## Beállítások
- **Kezdés időpontja:** `src/config.js` (`EVENT_START`), vagy `.env` fájlban: `VITE_EVENT_START=2026-10-31T10:00:00+01:00`
- **Szövegek:** `src/content.js` (szó szerint a landing.txt-ből)
- **Háttérkép:** `src/assets/bg.webp`
