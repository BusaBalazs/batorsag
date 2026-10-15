import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FINALE } from "../data/finale.js";
import { finalQuiz } from "../data/finalQuiz.js";
import { reduced } from "../lib/motion.js";
import { Quiz } from "./QuizGame.jsx";

// Ékezet- és kis/nagybetű-érzéketlen összehasonlítás ("batorsag" is elfogadott)
const normalize = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** A végső állomás: megfejtés beírása → siker-szöveg → végső kvíz (QR-kód nélkül, jó válasznál magától jön a következő kérdés). */
export default function FinalGame({ onComplete }) {
  const [part, setPart] = useState("riddle"); // riddle | success | quiz
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  // Minden szakasz belépő animációja
  useLayoutEffect(() => {
    if (reduced() || !rootRef.current) return; // a kvíz szakasznak nincs saját gyökéreleme
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { opacity: 0, y: 22, duration: 0.6, stagger: 0.12, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [part]);

  const submit = (e) => {
    e.preventDefault();
    if (normalize(value) === normalize(FINALE.answer)) {
      setWrong(false);
      setPart("success");
      return;
    }
    setWrong(true);
    if (!reduced()) gsap.fromTo(inputRef.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1.2, 0.25)" });
  };

  if (part === "quiz") return <QuizSequence questions={finalQuiz} onComplete={onComplete} />;

  if (part === "success") {
    return (
      <div ref={rootRef} className="flex flex-1 flex-col justify-center">
        <div className="panel flex flex-col gap-4 p-6 text-center">
          <div className="space-y-3 text-[1.05rem] leading-relaxed text-parchment/90">
            {FINALE.successParagraphs.map((p, i) => (
              <p key={i} data-in>
                {p}
              </p>
            ))}
          </div>
          <p data-in className="gold-text font-display text-2xl font-bold leading-snug">
            {FINALE.successHighlight}
          </p>
          <p data-in className="font-display text-base font-semibold text-gold-light border-t border-gold/40 pt-2">
            {FINALE.quizPrompt}
          </p>
          <button data-in type="button" className="btn-gold w-full" onClick={() => setPart("quiz")}>
            {FINALE.quizButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center">
      <div className="panel flex flex-col gap-4 p-6">
        <h2 data-in className="gold-text text-center font-display text-2xl font-bold leading-snug">
          {FINALE.headline}
        </h2>
        <div data-in className="space-y-3 text-[1.02rem] leading-relaxed text-parchment/90">
          {FINALE.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <form data-in onSubmit={submit} className="flex flex-col gap-3" noValidate>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setWrong(false);
            }}
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            placeholder={FINALE.inputPlaceholder}
            aria-label="A megfejtés"
            className={`w-full rounded-2xl border-2 bg-night/80 px-4 py-3 text-center text-lg text-parchment placeholder:text-parchment/40 focus:outline-2 focus:outline-offset-2 focus:outline-gold ${
              wrong ? "border-[#ff6b6b]" : "border-gold/60"
            }`}
          />
          <p className="min-h-6 text-center text-sm leading-snug text-[#ff9a9a]" aria-live="polite">
            {wrong ? FINALE.wrongMessage : ""}
          </p>
          <button type="submit" className="btn-gold w-full" disabled={!value.trim()}>
            {FINALE.submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

/** Kérdések egymás után: jó válasz után magától jön a következő, az utolsó után a játék lezárul. */
function QuizSequence({ questions, onComplete }) {
  const [i, setI] = useState(0);
  const next = () => (i + 1 >= questions.length ? onComplete() : setI(i + 1));
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-center font-display text-lg font-bold text-gold-light">
        {i + 1} / {questions.length}. kérdés
      </p>
      <Quiz key={i} question={questions[i]} onComplete={next} />
    </div>
  );
}
