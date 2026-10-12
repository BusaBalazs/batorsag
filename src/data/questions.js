// ─────────────────────────────────────────────────────────────
//  KVÍZKÉRDÉSEK – ezt a fájlt nyugodtan szerkesztheted
// ─────────────────────────────────────────────────────────────
//  stationId – melyik állomáshoz tartozik (stations.js → id)
//  question  – a kérdés (címsorként jelenik meg)
//  answers   – a válaszlehetőségek (általában 3)
//  correct   – a helyes válasz sorszáma az answers listában (0-tól kezdve!)
// ─────────────────────────────────────────────────────────────

export const questions = [
  {
    stationId: 1,
    question: "Melyik házba kerül Harry Potter a Roxfortban?",
    answers: ["Mardekár", "Griffendél", "Hugrabug"],
    correct: 1,
  },
  {
    stationId: 2,
    question: "Hányadik vágányról indul a Roxfort Expressz?",
    answers: ["7¼", "11½", "9¾"],
    correct: 2,
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
    stationId: 5,
    question: "Ki a Roxfort igazgatója Harry első évében?",
    answers: ["Minerva McGonagall", "Perselus Piton", "Albus Dumbledore"],
    correct: 2,
  },
  {
    stationId: 6,
    question: "Melyik labdát kell elkapnia a Fogónak a kviddicsmeccsen?",
    answers: ["Aranycikeszt", "Gurkót", "Kvaffot"],
    correct: 0,
  },
  {
    stationId: 7,
    question: "Milyen állat Hagrid kedvence, Norbert?",
    answers: ["Hippogriff", "Sárkány", "Főnix"],
    correct: 1,
  },
  {
    stationId: 8,
    question: "Melyik tárgy teszi láthatatlanná Harryt?",
    answers: ["Teszlek Süveg", "Bölcsek köve", "Láthatatlanná tévő köpeny"],
    correct: 2,
  },
  {
    stationId: 9,
    question: "Hogy hívják a varázslók bankját?",
    answers: ["Gringotts", "Szent Mungó", "Abszol út"],
    correct: 0,
  },
];
