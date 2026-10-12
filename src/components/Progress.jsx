import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

/** Állomás-számláló: "3. állomás / 9" + szegmentált haladássáv. */
export default function Progress({ step, total }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-seg]", { scaleX: 0, duration: 0.45, stagger: 0.04, ease: "power2.out", transformOrigin: "left center" });
      gsap.to("[data-current]", { opacity: 0.45, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, ref);
    return () => ctx.revert();
  }, [step]);

  return (
    <div ref={ref} className="w-full [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-display text-lg font-bold text-gold-light">
          {Math.min(step + 1, total)}. állomás
        </span>
        <span className="font-display text-sm font-semibold text-parchment/70">
          {Math.min(step, total)} / {total} kész
        </span>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            data-seg
            {...(i === step ? { "data-current": true } : {})}
            className={`h-2.5 flex-1 rounded-full border ${
              i < step
                ? "border-gold-light/70 bg-linear-to-b from-gold-light to-gold shadow-[0_0_8px_rgba(233,185,92,0.7)]"
                : i === step
                  ? "border-gold bg-gold/70 shadow-[0_0_10px_rgba(233,185,92,0.8)]"
                  : "border-gold/25 bg-night/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
