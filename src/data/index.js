import { stations } from "./stations.js";
import { questions } from "./questions.js";

export { stations };

const stationMap = new Map(stations.map((s) => [s.id, s]));
const questionMap = new Map(questions.map((q) => [q.stationId, q]));

export const getStation = (id) => stationMap.get(id);
export const getQuestion = (stationId) => questionMap.get(stationId);
