import QuizGame from "./QuizGame.jsx";
import TextGame from "./TextGame.jsx";
import PlaceholderGame from "./PlaceholderGame.jsx";
import SnitchGame from "./SnitchGame.jsx";
import SpiralGame from "./SpiralGame.jsx";
import PotionGame from "./PotionGame.jsx";
import EdevisMirror from "./EdevisMirror.jsx";
import Ron from "./Ron.jsx";
import Train from "./Train.jsx";
import ChessBoard from "./ChessBoard.jsx";
import Kviddics from "./Kviddics.jsx";
import FinalGame from "./FinalGame.jsx";

// ─────────────────────────────────────────────────────────────
//  JÁTÉKOK – melyik állomáson melyik játék töltődik be
// ─────────────────────────────────────────────────────────────
//  kulcs  – az állomás száma (= a QR-kód tartalma)
//  érték  – a játék komponense
//
//  Minden játék komponens két propot kap:
//    station    – az állomás adatai (station.id, station.name, …)
//    onComplete – ezt a függvényt kell meghívni, amikor a játékos sikeresen teljesítette a játékot;
//                 ekkor a játék visszatér a térképhez, a következő állomás jelölésével.
//
//  Elérhető játékok:
//    QuizGame        – kérdés + válaszok (a kérdések: src/data/questions.js)
//    TextGame        – szöveg + „tovább megyek” gomb + megerősítés (a szöveg: src/data/stationTexts.js)
//    SnitchGame      – cikeszvadászat (beállítások: config.js → SNITCH_GAME)
//    SpiralGame      – varázsspirál (beállítások: config.js → SPIRAL_GAME)
//    PotionGame      – bájitalfőzés (recept: src/data/potion.js)
//    FinalGame       – végső állomás: megfejtés + záró kvíz (szövegek: src/data/finale.js, finalQuiz.js)
//    PlaceholderGame – ideiglenes: „n. állomás játéka” + siker gomb
//
//  Új, saját játék: hozz létre egy komponenst a src/games/ mappában, és add meg itt az állomásánál.
// ─────────────────────────────────────────────────────────────

const games = {
  1: Train,
  2: TextGame,
  3: Kviddics,
  4: EdevisMirror,
  5: Ron,
  6: SpiralGame,
  7: ChessBoard,
  8: PotionGame,
  9: QuizGame,
  10: QuizGame,
  11: QuizGame,
  12: QuizGame,
  13: QuizGame,
  14: FinalGame,
};

export const getGame = (stationId) => games[stationId] ?? PlaceholderGame;
