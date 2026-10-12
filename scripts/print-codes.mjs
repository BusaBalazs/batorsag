// A nyomtatható QR-kódok tartalmának kilistázása: node scripts/print-codes.mjs
import { stations } from "../src/data/stations.js";

for (const s of stations) {
  console.log(`${s.code}  ${s.name}`);
}
