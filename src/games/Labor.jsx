import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getQuestion } from "../data/index.js";
import { stationTexts } from "../data/stationTexts.js";
import { reduced } from "../lib/motion.js";
import PlaceholderGame from "./PlaceholderGame.jsx";
import { Quiz } from "./QuizGame.jsx";

/**
 * Laborállomás: a „Titkos vizsga” gomb után az állomás három kérdéses kvíze következik.
 */
export default function Labor({ station, onComplete }) {
  const content = stationTexts[station.id];
  const quiz = getQuestion(station.id)?.quiz;
  const rootRef = useRef(null);
  const [started, setStarted] = useState(false);

  useLayoutEffect(() => {
    if (reduced() || !content) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { opacity: 0, y: 22, duration: 0.6, stagger: 0.12, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [content]);

  if (!content || !quiz?.length) return <PlaceholderGame station={station} onComplete={onComplete} />;
  if (started) return <QuizSequence questions={quiz} onComplete={onComplete} />;

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center gap-4">
      <div className="panel flex flex-col gap-4 p-6">
        <h2 data-in className="gold-text text-center font-display text-2xl font-bold leading-snug">
          {content.headline}
        </h2>
        <div data-in className="space-y-3 text-[1.02rem] leading-relaxed text-parchment/90">
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <button data-in type="button" className="btn-gold mt-1 w-full" onClick={() => setStarted(true)}>
          {content.buttonLabel}
        </button>
      </div>
    </div>
  );
}

function QuizSequence({ questions, onComplete }) {
  const [index, setIndex] = useState(0);
  const next = () => (index + 1 >= questions.length ? onComplete() : setIndex(index + 1));

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-center font-display text-lg font-bold text-gold-light">
        {index + 1} / {questions.length}. kérdés
      </p>
      <Quiz key={index} question={questions[index]} onComplete={next} />
    </div>
  );
}
