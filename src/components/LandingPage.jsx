import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Accordion from "./Accordion.jsx";
import Items from "./Items.jsx";
import {
  hero,
  sections,
  closing,
  consentLabel,
  enterLabel,
} from "../content.js";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function StarDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-xs items-center gap-3 text-gold"
    >
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-gold/70" />
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
        <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-gold/70" />
    </div>
  );
}

export default function LandingPage({ onEnter }) {
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const [accepted, setAccepted] = useState(false);

  // Egyetlen, összehangolt belépő animáció betöltéskor
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero]", { opacity: 0, y: 22, duration: 0.9, stagger: 0.14 })
        .from(
          "[data-acc]",
          { opacity: 0, y: 14, duration: 0.6, stagger: 0.12 },
          "-=0.45"
        )
        .from("[data-closing]", { opacity: 0, duration: 0.8 }, "-=0.2");
      // finom, lassú csillogás a csillagos elválasztón
      gsap.to("[data-twinkle]", {
        opacity: 0.55,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);
    return () => mm.revert();
  }, []);

  // A gomb aktiválásakor egy kis "felgyulladás"
  useEffect(() => {
    if (!accepted || !buttonRef.current || reduced()) return;
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.6, ease: "back.out(2.4)" }
    );
  }, [accepted]);

  const handleEnter = () => {
    if (!accepted) return;
    if (reduced()) {
      onEnter();
      return;
    }
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: onEnter,
    });
  };

  return (
    <div ref={rootRef} className="landing-bg flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-10 pt-10 sm:pt-16">
        <header className="mb-8 space-y-5 text-center sm:mb-10">
          <div data-hero data-twinkle>
            <StarDivider />
          </div>
          <h1
            data-hero
            className="font-display text-3xl font-bold leading-tight sm:text-5xl"
          >
            <span aria-hidden="true" className="mr-2 align-middle">
              {hero.icon}
            </span>
            <span className="gold-text">{hero.title}</span>
          </h1>
          <p
            data-hero
            className="mx-auto max-w-md text-base italic leading-relaxed text-parchment/80 sm:text-lg"
          >
            {hero.subtitle}
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <Accordion
              key={s.title}
              icon={s.icon}
              title={s.title}
              defaultOpen={i === 0}
            >
              <Items items={s.items} />
            </Accordion>
          ))}
        </div>

        <p
          data-closing
          className="mt-10 text-center font-display text-lg font-semibold leading-relaxed text-gold-light sm:text-xl"
        >
          {closing}
        </p>
      </main>

      <footer className="sticky bottom-0 border-t border-gold/25 bg-night/85 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`grid size-7 shrink-0 place-items-center rounded-md border-2 transition-all duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${
                accepted
                  ? "border-gold bg-gold text-night"
                  : "border-gold/60 bg-deep/60"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`size-5 transition-opacity duration-300 ${
                  accepted ? "opacity-100" : "opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span className="font-display text-base font-semibold text-gold-light">
              {consentLabel}
            </span>
          </label>

          <button
            ref={buttonRef}
            type="button"
            disabled={!accepted}
            onClick={handleEnter}
            className={`rounded-full px-10 py-3 font-display text-lg font-bold tracking-wide transition-[background,box-shadow,color,border-color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light ${
              accepted
                ? "cursor-pointer bg-linear-to-b from-gold-light via-gold to-gold-dark text-night shadow-[0_0_28px_rgba(233,185,92,0.55)] hover:shadow-[0_0_38px_rgba(233,185,92,0.8)]"
                : "cursor-not-allowed border border-gold/25 bg-deep/40 text-parchment/35"
            }`}
          >
            {enterLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}
