// ─────────────────────────────────────────────────────────────
//  KVÍZKÉRDÉSEK az állomásokhoz – ezt a fájlt nyugodtan szerkesztheted
// ─────────────────────────────────────────────────────────────
//  stationId – melyik állomáshoz tartozik (stations.js → id). Csak a kvíz típusú állomásoknak kell kérdés
//              (hogy melyik állomás kvíz, azt a src/games/index.js-ben állítod be).
//  question  – a kérdés (címsorként jelenik meg)
//  answers   – a válaszlehetőségek (3 vagy 4 is lehet)
//  correct   – a helyes válasz sorszáma az answers listában (0-tól kezdve!)
// ─────────────────────────────────────────────────────────────

export const questions = [
  {
    stationId: 25,
    question: "Melyik házba kerül Harry Potter a Roxfortban?",
    answers: ["Mardekár", "Griffendél", "Hugrabug"],
    correct: 1,
  },
  {
    stationId: 3,
    question: "Hogy hívják Harry Potter hóbagolyát?",
    answers: ["Hedvig", "Errol", "Fawkes"],
    correct: 0,
  },
  {
    stationId: 4,
    question: "Melyik varázsige gyújt fényt a pálca végén?",
    answers: ["Accio", "Lumos", "Expelliarmus"],
    correct: 1,
  },
  {
    // Köd Kapuja: ikonok → betűk. A helyes megfejtés a FÉNY (🌙 F, ⭐ É, ◇ N, ☀ Y).
    stationId: 13,
    question:
      "A köd elrejtette a fény őrzőinek jeleit. Négy jel van elrejtve a Köd Kapujában. Csak az elemlámpád fényében válnak láthatóvá. Találd meg őket, és fejtsd meg, merre vezet a kijárat!",
    answers: [
      "⚡ → H, 🦉 → O, 🔥 → L, 🗝 → D", // HOLD
      "🐍 → L, 🦁 → Á, 🍀 → N, 🏰 → G", // LÁNG
      "🌙 → F, ⭐ → É, ◇ → N, ☀ → Y", // FÉNY
      "🔮 → T, 🧪 → O, 📜 → L, 🎩 → L", // TOLL
    ],
    correct: 2,
  },
  {
    // vonat
    stationId: 1,
    headline: "Kedves Varázslódiákok!",
    paragraphs: [
      "Elérkezett a pillanat, amelyre minden ifjú varázsló vár!",
      "A Roxfort Expressz hamarosan indul, de a vonatot nem találjátok meg a közönséges vágányok között. A 9 és ¾. vágányhoz egy titkos átjáró vezet, amelyet csak az igazi varázslódiákok képesek megtalálni. Mielőtt átléphetnétek a varázsfalon, össze kell készítenetek az útipoggyászotokat! Vajon tudjátok, hogy mit kell magatokkal vinni az első tanévre?Válasszátok ki a megfelelő felszereléseket! Ha sikeresen összepakoltatok, megnyílik előttetek az út a varázsvilág felé. A vonat nem vár örökké…",
    ],
    succesText:
      "A Roxfort Expressz indulásra kész! Fogjátok meg a poggyászkocsit, és lépjetek át a varázsvilágba!",
    question:
      "9 és ¾. vágány – Roxforti csomaglista: Te mit vinnél magaddal az első tanévre? Válaszd ki a megfelelő felszereléseket!",
    answers: [
      "🪄 Varázspálca",
      "💨 Hajszárító",
      "🧥 Varázslótalár",
      "⚗️ Üst",
      "🔭 Távcső",
      "📚 Varázskönyvek",
      "🛹 Gördeszka",
    ],
    correct: [0, 2, 3, 5],
  },
];
