import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

function formatDuration(ms) {
  const totalMin = Math.max(1, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h} óra ${m} perc` : `${m} perc`;
}

export default function FinishView({ startedAt, finishedAt, total, onReset }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-trophy]", { scale: 0, rotate: -30, duration: 1, ease: "elastic.out(1, 0.5)" })
        .from("[data-in]", { opacity: 0, y: 24, duration: 0.6, stagger: 0.14 }, "-=0.5");
      gsap.to("[data-trophy]", { y: -8, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });
      gsap.to("[data-star]", { rotate: 360, duration: 8, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const confirmReset = () => {
    if (window.confirm("Biztosan újrakezded a játékot? A mostani állásod törlődik.")) onReset();
  };

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center">
      <div className="panel flex flex-col items-center gap-4 p-7 text-center">
        <div className="grid place-items-center">
          <svg data-star viewBox="0 0 24 24" className="size-32 text-gold/35" style={{ gridArea: "1 / 1" }} fill="currentColor" aria-hidden="true">
            <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
          </svg>
          <span data-trophy className="text-6xl" style={{ gridArea: "1 / 1" }} aria-hidden="true">
            🏆
          </span>
        </div>
        <h2 data-in className="gold-text font-display text-3xl font-bold leading-tight">
          Gratulálunk, igazi bátor varázsló vagy!
        </h2>
        <p data-in className="text-lg leading-relaxed text-parchment/90">
          Az összes állomást teljesítetted ({total} / {total}), a Bátorságpróba véget ért.
        </p>
        {startedAt && finishedAt && (
          <p data-in className="font-display text-base font-semibold text-gold-light">
            Teljesítési idő: {formatDuration(finishedAt - startedAt)}
          </p>
        )}
        <button data-in type="button" className="btn-ghost mt-2" onClick={confirmReset}>
          Játék újraindítása
        </button>
      </div>
    </div>
  );
}
