import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";
import { WRONG_ANSWER_LOCK_MS } from "../config.js";
import { getQuestion } from "../data/index.js";
import PlaceholderGame from "./PlaceholderGame.jsx";

const HOUSES = ["house-green", "house-blue", "house-gold", "house-purple"];

/** Kvíz típusú játék: a kérdést a src/data/questions.js-ből veszi az állomás száma alapján. */
export default function Train({ station, onComplete }) {
  const question = getQuestion(station.id);
  // Ha ehhez az állomáshoz nincs kérdés felvéve, ne akadjon el a játékos
  if (!question)
    return <PlaceholderGame station={station} onComplete={onComplete} />;
  return <Quiz question={question} onComplete={onComplete} />;
}

/** Kérdés címsorként + válaszlehetőségek. Rossz válasz: piros háttér, 3 mp múlva újra lehet próbálni. */
export function Quiz({ question, onComplete }) {
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | wrong | correct
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(() => new Set());
  const timer = useRef(0);
  const correctAnswers = Array.isArray(question.correct)
    ? question.correct
    : [question.correct];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-card]", {
          scale: 0.85,
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "back.out(1.6)",
        })
        .from(
          "[data-answer]",
          {
            x: (i) => (i % 2 ? 60 : -60),
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
          },
          "-=0.25",
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (status !== "correct" || dialog.open) return;

    dialog.showModal();
    if (!reduced()) {
      gsap.fromTo(
        dialog,
        { scale: 0.75, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" },
      );
    }
  }, [status]);

  // A rossz válasz utáni „várakozás” sáv a render után indul (addigra létezik az elem)
  useEffect(() => {
    if (status !== "wrong" || reduced()) return;
    const tween = gsap.fromTo(
      "[data-timer]",
      { scaleX: 1 },
      {
        scaleX: 0,
        duration: WRONG_ANSWER_LOCK_MS / 1000,
        ease: "none",
        transformOrigin: "left center",
      },
    );
    return () => tween.kill();
  }, [status]);

  const choose = (i, el) => {
    if (status !== "idle" || solved.has(i)) return;
    setSelected(i);
    if (correctAnswers.includes(i)) {
      const nextSolved = new Set(solved);
      nextSolved.add(i);
      setSolved(nextSolved);
      if (!reduced()) {
        gsap.fromTo(
          el,
          { scale: 0.94 },
          { scale: 1.04, duration: 0.45, ease: "elastic.out(1, 0.45)" },
        );
        gsap.fromTo(
          "[data-card]",
          { boxShadow: "0 0 0 0 rgba(255,225,120,0)" },
          {
            boxShadow: "0 0 60px 12px rgba(255,225,120,0.55)",
            duration: 0.6,
            yoyo: true,
            repeat: 1,
          },
        );
      }
      if (correctAnswers.every((answer) => nextSolved.has(answer))) {
        setStatus("correct");
      }
    } else {
      setStatus("wrong");
      if (!reduced()) {
        gsap.fromTo(
          el,
          { x: -10 },
          { x: 0, duration: 0.6, ease: "elastic.out(1.2, 0.25)" },
        );
      }
      timer.current = window.setTimeout(() => {
        setStatus("idle");
        setSelected(null);
      }, WRONG_ANSWER_LOCK_MS);
    }
  };

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center">
      <div data-card className="panel p-5 sm:p-6">
        {question.headline && (
          <>
            <h2
              data-in
              className="gold-text text-center font-display text-2xl font-bold leading-snug"
            >
              {question.headline}
            </h2>
            <div
              data-in
              className="space-y-3 text-[1.02rem] leading-relaxed text-parchment/90 mb-8"
            >
              {question.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </>
        )}

        <h2
          className={`mb-6 text-center font-display font-bold leading-snug text-balance gold-text ${
            question.question.length > 110 ? "text-lg" : "text-[1.65rem]"
          }`}
        >
          {question.question}
        </h2>

        <ul className="space-y-4">
          {question.answers.map((answer, i) => {
            const isSel = selected === i;
            const cls =
              isSel && status === "wrong"
                ? "answer-wrong"
                : solved.has(i)
                  ? "answer-correct"
                  : "";
            return (
              <li key={i} data-answer>
                <button
                  type="button"
                  disabled={status !== "idle" || solved.has(i)}
                  onClick={(e) => choose(i, e.currentTarget)}
                  className={`answer-btn ${HOUSES[i % HOUSES.length]} ${cls} ${
                    status !== "idle" && !isSel && !solved.has(i)
                      ? "opacity-45"
                      : ""
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>{answer}</span>
                    {solved.has(i) && (
                      <span
                        aria-hidden="true"
                        className="text-xl font-bold text-green-400"
                      >
                        ✓
                      </span>
                    )}
                    {isSel && status === "wrong" && (
                      <span aria-hidden="true">✖</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 min-h-14 text-center" aria-live="polite">
          {status === "wrong" && (
            <div>
              <p className="font-display text-base font-semibold text-[#ff9a9a]">
                Nem jó válasz! Próbáld újra egy pillanat múlva.
              </p>
              <div className="mx-auto mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-night/70">
                <div
                  data-timer
                  className="h-full w-full rounded-full bg-[#ff6b6b]"
                />
              </div>
            </div>
          )}
          {status === "correct" && (
            <dialog
              ref={dialogRef}
              aria-labelledby="quiz-success-title"
              onCancel={(event) => event.preventDefault()}
              className="m-auto w-[min(92vw,26rem)] rounded-3xl border-[3px] border-gold bg-linear-to-b from-[#12315e] to-[#071427] p-6 text-center text-parchment shadow-[0_0_50px_rgba(233,185,92,0.4)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
            >
              <h2
                id="quiz-success-title"
                className="mb-3 font-display text-2xl font-bold text-gold-light"
              >
                Sikeres megoldás!
              </h2>
              <p className="mb-6 text-lg leading-relaxed">
                {question.succesText ?? "Helyes válasz!"}
              </p>
              <button
                type="button"
                className="btn-gold w-full"
                autoFocus
                onClick={() => {
                  dialogRef.current.close();
                  onComplete();
                }}
              >
                Tovább
              </button>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
}
