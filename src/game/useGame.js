import { useCallback, useEffect, useRef, useState } from "react";
import { stations, getStation } from "../data/index.js";
import { STORAGE_KEY } from "../config.js";
import { extractCode } from "./qr.js";

// Ha az állomások listája megváltozik, a régi mentés érvénytelen.
const signature = stations.map((s) => `${s.id}${s.final ? "f" : ""}`).join(",");
const STAGES = ["landing", "countdown", "story", "game"];

const fresh = (stage = "landing") => ({
  v: 3,
  sig: signature,
  stage, // landing → countdown → story → game
  order: [], // a játékos saját állomás-sorrendje (állomás id-k): véletlenszerű, a végső állomás(ok) a végén
  step: 0, // hanyadik állomásnál tart
  phase: "map", // map: keresi a kódot · game: a kód megvolt, jön az állomás játéka
  startedAt: null,
  finishedAt: null,
});

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Véletlenszerű sorrend a hagyományos állomásokból, a "final" állomások mindig utoljára. */
function makeOrder() {
  const regular = stations.filter((s) => !s.final).map((s) => s.id);
  const finals = stations.filter((s) => s.final).map((s) => s.id);
  return [...shuffle(regular), ...finals];
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh();
    const s = JSON.parse(raw);
    if (!s || s.sig !== signature || !STAGES.includes(s.stage)) return fresh();
    if (s.stage === "game") {
      const valid =
        Array.isArray(s.order) &&
        s.order.length === stations.length &&
        s.order.every((id) => getStation(id));
      if (!valid) return fresh("countdown");
    }
    return { ...fresh(), ...s };
  } catch {
    return fresh();
  }
}

export function useGame() {
  const [state, setState] = useState(read);
  const ref = useRef(state);
  ref.current = state;

  // Mentés minden változáskor
  useEffect(() => {
    try {
      const json = JSON.stringify(state);
      if (localStorage.getItem(STORAGE_KEY) !== json)
        localStorage.setItem(STORAGE_KEY, json);
    } catch {
      /* privát mód / tele a tár – a játék memóriában tovább megy */
    }
  }, [state]);

  // Több fül esetén (pl. a kamera appból megnyílt új fül) a játékállás szinkronban marad
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY || e.key === null) setState(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const acceptRules = useCallback(
    () =>
      setState((s) =>
        s.stage === "landing" ? { ...s, stage: "countdown" } : s,
      ),
    [],
  );

  /** Start gomb a visszaszámlálón: jön a bevezető történet. */
  const showStory = useCallback(
    () =>
      setState((s) => (s.stage === "countdown" ? { ...s, stage: "story" } : s)),
    [],
  );

  /** A történet végén: elindul a játék, kisorsoljuk a játékos állomás-sorrendjét. */
  const startGame = useCallback(
    () =>
      setState((s) =>
        s.stage === "story"
          ? {
              ...s,
              stage: "game",
              order: makeOrder(),
              step: 0,
              phase: "map",
              startedAt: Date.now(),
              finishedAt: null,
            }
          : s,
      ),
    [],
  );

  /** Beolvasott kód ellenőrzése. Visszatér: "correct" | "wrong" | "ignored" */
  const submitCode = useCallback((text) => {
    const s = ref.current;
    if (s.stage !== "game" || s.phase !== "map" || s.step >= s.order.length)
      return "ignored";
    const expected = getStation(s.order[s.step]);
    // A QR-kód tartalma az állomás száma
    if (expected && extractCode(text) === String(expected.id)) {
      setState((p) => (p.phase === "map" ? { ...p, phase: "game" } : p));
      return "correct";
    }
    return "wrong";
  }, []);

  const completeStation = useCallback(
    () =>
      setState((s) => {
        const step = s.step + 1;
        return {
          ...s,
          step,
          phase: "map",
          finishedAt: step >= s.order.length ? Date.now() : null,
        };
      }),
    [],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(fresh("countdown"));
  }, []);

  return {
    state,
    acceptRules,
    showStory,
    startGame,
    submitCode,
    completeStation,
    reset,
  };
}
