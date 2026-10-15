// A QR-kódok tartalmának kilistázása (a QR tartalma az állomás száma): node scripts/print-codes.mjs
import { stations } from "../src/data/stations.js";

for (const s of stations) {
  console.log(`${s.id}  ${s.name}`);
}
