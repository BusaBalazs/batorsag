import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import GameShell from "../components/GameShell.jsx";
import Progress from "../components/Progress.jsx";
import MapView from "../components/MapView.jsx";
import ScannerView from "../components/ScannerView.jsx";
import QuizView from "../components/QuizView.jsx";
import FinishView from "../components/FinishView.jsx";
import WarningDialog from "../components/WarningDialog.jsx";
import { getStation, getQuestion } from "../data/index.js";
import { reduced } from "../lib/motion.js";

export default function GameScreen({ game, incomingCode, onIncomingHandled }) {
  const { state, submitCode, completeStation, reset } = game;
  const total = state.order.length;
  const finished = state.step >= total;
  const station = finished ? null : getStation(state.order[state.step]);

  const [scanning, setScanning] = useState(false);
  const [warning, setWarning] = useState(false);
  const handled = useRef(false);
  const rootRef = useRef(null);

  // A telefon saját kamerájával beolvasott QR (?k=KÓD) feldolgozása – egyszer, induláskor
  useEffect(() => {
    if (!incomingCode || handled.current) return;
    handled.current = true;
    if (submitCode(incomingCode) === "wrong") setWarning(true);
    onIncomingHandled();
  }, [incomingCode, submitCode, onIncomingHandled]);

  // Képernyőváltáskor finom beúszás
  const screenKey = finished ? "finish" : scanning ? "scan" : state.phase;
  useLayoutEffect(() => {
    if (reduced()) return;
    const el = rootRef.current;
    // fromTo + clearProps: ha az animációt félúton megszakítja egy újabb képernyőváltás, sem marad átlátszó
    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", clearProps: "opacity" });
    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "opacity" });
    };
  }, [screenKey]);

  const handleScan = (text) => {
    setScanning(false);
    const result = submitCode(text);
    if (result === "wrong") setWarning(true);
  };

  let body;
  if (finished) {
    body = (
      <FinishView startedAt={state.startedAt} finishedAt={state.finishedAt} total={total} onReset={reset} />
    );
  } else if (state.phase === "quiz") {
    body = (
      <>
        <Progress step={state.step} total={total} />
        <QuizView key={station.id} question={getQuestion(station.id)} onCorrect={completeStation} />
      </>
    );
  } else {
    body = (
      <>
        <Progress step={state.step} total={total} />
        <div className="flex flex-1 flex-col justify-center gap-5 py-4">
          <p className="text-center font-display text-lg font-semibold text-gold-light">
            Keresd meg a jelölt helyet, és olvasd be az ott lévő QR-kódot!
          </p>
          <MapView key={station.id} station={station} />
        </div>
        <button type="button" className="btn-gold w-full" onClick={() => setScanning(true)}>
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10" />
          </svg>
          QR-kód beolvasása
        </button>
      </>
    );
  }

  if (scanning && !finished && state.phase === "map") {
    body = <ScannerView onResult={handleScan} onCancel={() => setScanning(false)} />;
  }

  return (
    <GameShell>
      <div ref={rootRef} data-screen className="flex min-h-0 flex-1 flex-col gap-4">
        {body}
      </div>
      <WarningDialog open={warning} onClose={() => setWarning(false)} />
    </GameShell>
  );
}
