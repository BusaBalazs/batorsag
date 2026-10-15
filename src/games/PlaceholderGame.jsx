import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

/** Ideiglenes játék: kiírja az állomás számát, és egy gombbal szimulálja a sikeres teljesítést. */
export default function PlaceholderGame({ station, onComplete }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center">
      <div className="panel flex flex-col items-center gap-6 p-7 text-center">
        <h2 data-in className="gold-text font-display text-3xl font-bold leading-tight">
          {station.id}. állomás játéka
        </h2>
        <button data-in type="button" className="btn-gold w-full" onClick={onComplete}>
          Sikeres játékteljesítés
        </button>
      </div>
    </div>
  );
}
