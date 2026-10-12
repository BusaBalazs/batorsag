import { stations } from "./stations.js";
import { questions } from "./questions.js";

export { stations, questions };

const stationMap = new Map(stations.map((s) => [s.id, s]));
const questionMap = new Map(questions.map((q) => [q.stationId, q]));

export const getStation = (id) => stationMap.get(id);

const MISSING = {
  question: "Ehhez az állomáshoz még nincs kérdés. Lépj tovább!",
  answers: ["Tovább"],
  correct: 0,
};

export const getQuestion = (stationId) => questionMap.get(stationId) ?? MISSING;

// Fejlesztés közben figyelmeztet, ha hiányzik valami az adatokból
if (import.meta.env.DEV) {
  for (const s of stations) {
    if (!questionMap.has(s.id)) console.warn(`[data] A(z) ${s.id}. állomáshoz nincs kérdés a questions.js-ben.`);
  }
  const codes = stations.map((s) => s.code.toLowerCase());
  if (new Set(codes).size !== codes.length) console.warn("[data] Két állomásnak ugyanaz a kódja!");
}
