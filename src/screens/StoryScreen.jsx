import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import GameShell from "../components/GameShell.jsx";
import { STORY } from "../data/story.js";
import { reduced } from "../lib/motion.js";

/** Bevezető történet diákra bontva. Az utolsó dián a gomb elindítja a játékot. */
export default function StoryScreen({ onStart }) {
  const [i, setI] = useState(0);
  const dir = useRef(1);
  const slideRef = useRef(null);
  const headRef = useRef(null);
  const swipeX = useRef(null);
  const slide = STORY.slides[i];
  const last = i === STORY.slides.length - 1;

  useLayoutEffect(() => {
    if (reduced()) return;
    const t = gsap.from(headRef.current, { opacity: 0, y: -20, duration: 0.9, ease: "power3.out" });
    return () => t.kill();
  }, []);

  // Diaváltáskor a szöveg beúszik, és a görgetés az elejére áll
  useLayoutEffect(() => {
    const el = slideRef.current;
    el.scrollTop = 0;
    if (reduced()) return;
    const t = gsap.fromTo(
      el,
      { opacity: 0, x: dir.current * 36 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", clearProps: "opacity,transform" }
    );
    return () => {
      t.kill();
      gsap.set(el, { clearProps: "opacity,transform" });
    };
  }, [i]);

  const go = (n) => {
    if (n < 0 || n >= STORY.slides.length) return;
    dir.current = n > i ? 1 : -1;
    setI(n);
  };

  // Húzással (swipe) is lehet lapozni; a függőleges görgetés érintetlen marad
  const onPointerDown = (e) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeX.current == null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (dx < -60) go(i + 1);
    else if (dx > 60) go(i - 1);
  };

  return (
    <GameShell>
      <div className="flex flex-1 flex-col justify-center gap-4 py-2">
        <h1
          ref={headRef}
          className="gold-text text-center font-display text-3xl font-bold leading-tight tracking-wide"
        >
          {STORY.headline}
        </h1>

        <div className="panel p-1.5">
          <div
            ref={slideRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="max-h-[calc(100svh-17rem)] touch-pan-y overflow-y-auto rounded-[1.1rem] px-4 py-4"
          >
            {slide.title && (
              <h2 className="mb-3 font-display text-xl font-bold leading-snug text-gold-light">{slide.title}</h2>
            )}
            <div className="space-y-3 text-base leading-relaxed text-parchment/90">
              {slide.paragraphs.map((p, k) => (
                <p key={k}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2.5" role="tablist" aria-label="Diák">
          {STORY.slides.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`${k + 1}. dia`}
              onClick={() => go(k)}
              className={`h-3 rounded-full border transition-[width,background-color] duration-300 ${
                k === i ? "w-8 border-gold-light bg-gold shadow-[0_0_10px_rgba(233,185,92,0.8)]" : "w-3 border-gold/50 bg-night/60"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`btn-ghost ${i === 0 ? "invisible" : ""}`}
            onClick={() => go(i - 1)}
            tabIndex={i === 0 ? -1 : 0}
          >
            {STORY.backLabel}
          </button>
          {last ? (
            <button type="button" className="btn-gold flex-1" onClick={onStart}>
              {STORY.startLabel}
            </button>
          ) : (
            <button type="button" className="btn-gold flex-1" onClick={() => go(i + 1)}>
              {STORY.nextLabel}
            </button>
          )}
        </div>
      </div>
    </GameShell>
  );
}
