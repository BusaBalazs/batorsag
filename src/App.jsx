import { useCallback, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import CountdownPage from "./components/CountdownPage.jsx";
import StoryScreen from "./screens/StoryScreen.jsx";
import GameScreen from "./screens/GameScreen.jsx";
import UnsupportedBrowser from "./screens/UnsupportedBrowser.jsx";
import { useGame } from "./game/useGame.js";
import { INITIAL_CODE } from "./game/incomingCode.js";
import { isInAppBrowser } from "./game/inAppBrowser.js";

export default function App() {
  // Beágyazott böngészőben (Facebook, Instagram, QR-olvasó app…) nem engedjük futni a játékot
  if (isInAppBrowser()) return <UnsupportedBrowser />;
  return <Root />;
}

function Root() {
  const game = useGame();
  const [incoming, setIncoming] = useState(INITIAL_CODE);
  const clearIncoming = useCallback(() => setIncoming(null), []);
  const { stage } = game.state;

  if (stage === "game") {
    return <GameScreen game={game} incomingCode={incoming} onIncomingHandled={clearIncoming} />;
  }
  if (stage === "story") {
    return <StoryScreen onStart={game.startGame} />;
  }
  if (stage === "countdown") {
    return <CountdownPage onStart={game.showStory} />;
  }
  return (
    <LandingPage
      onEnter={() => {
        window.scrollTo(0, 0);
        game.acceptRules();
      }}
    />
  );
}
