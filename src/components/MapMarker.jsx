import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

/**
 * A következő QR-kód helyének jelölője. A térkép nagyításától függetlenül
 * azonos méretű marad (--z = aktuális zoom), és folyamatosan lüktet (scale animáció).
 * Egyetlen indokolt `absolute`: a jelölő a térkép képének %-os koordinátáján ül.
 */
export default function MapMarker({ x, y }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-pop]", { scale: 0, duration: 0.7, ease: "back.out(2.4)", delay: 0.5 });
      gsap.to("[data-core]", { scale: 1.22, duration: 0.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo(
        "[data-ring]",
        { scale: 0.9, opacity: 0.75 },
        { scale: 2.8, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out", stagger: 0.9 }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const center = "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2";
  return (
    <div
      ref={root}
      className="pointer-events-none absolute size-0"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="size-0" style={{ transform: "scale(calc(1 / var(--z, 1)))" }}>
        <div data-pop className="size-0">
          <span data-ring className={`${center} size-12 rounded-full border-[3px] border-gold-light bg-crimson/30`} />
          <span data-ring className={`${center} size-12 rounded-full border-[3px] border-gold-light bg-crimson/30`} />
          <span
            data-core
            className={`${center} grid size-12 place-items-center rounded-full border-[3px] border-gold-light bg-radial from-[#ff6b6b] to-crimson shadow-[0_0_0_3px_rgba(5,13,28,0.85),0_0_26px_8px_rgba(255,214,120,0.85)]`}
          >
            <svg viewBox="0 0 24 24" className="size-6 text-white drop-shadow" fill="currentColor" aria-hidden="true">
              <path d="M13.5 1 4 13.5h6L8.5 23 20 9.5h-6.5z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
