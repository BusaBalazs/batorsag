import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import bg from "../assets/bg.webp";
import { EVENT_START } from "../config.js";

const target = new Date(EVENT_START).getTime();

function getParts() {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    done: diff === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

function Tile({ value, label, valueRef }) {
  return (
    <div className="flex w-[15cqw] flex-col items-center rounded-[2cqw] border border-gold/40 bg-deep/70 py-[1.6cqw] shadow-[0_0_3cqw_-1cqw_rgba(233,185,92,0.35)] backdrop-blur-sm">
      <span
        ref={valueRef}
        className="gold-text font-display text-[8.5cqw] font-bold leading-none tabular-nums"
      >
        {value}
      </span>
      <span className="mt-[1cqw] text-[3cqw] italic leading-none text-parchment/75">
        {label}
      </span>
    </div>
  );
}

export default function CountdownPage() {
  const rootRef = useRef(null);
  const secRef = useRef(null);
  const [t, setT] = useState(getParts);

  useEffect(() => {
    const id = setInterval(() => setT(getParts()), 1000);
    return () => clearInterval(id);
  }, []);

  // Belépő animáció: a kép és a visszaszámláló feltűnik
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(rootRef.current, { opacity: 0, duration: 0.9, ease: "power2.out" });
      gsap.from("[data-count]", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        delay: 0.35,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, rootRef);
    return () => mm.revert();
  }, []);

  // A másodperc-számláló finom "ketyegése"
  useEffect(() => {
    if (!secRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      secRef.current,
      { opacity: 0.45, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [t.seconds]);

  return (
    <div
      ref={rootRef}
      className="countdown-bg grid min-h-dvh place-items-center"
    >
      {/* A kép mindig teljes egészében látszik; a wrapper a kép arányát követi */}
      <div className="grid w-[min(100vw,calc(100dvh*917/1024))] [aspect-ratio:917/1024] [container-type:inline-size]">
        <img
          src={bg}
          alt="Bátorságpróba – Varázslat, rejtély, kaland"
          className="block size-full object-contain"
          style={{ gridArea: "1 / 1" }}
          draggable="false"
        />

        {/* A tartalom ugyanabba a grid-cellába kerül, a kép sötét, üres közepére */}
        <div
          className="grid grid-rows-[34%_40%_26%] justify-items-center"
          style={{ gridArea: "1 / 1" }}
        >
          <div />
          <div className="flex flex-col items-center justify-center gap-[3.5cqw]">
            <p data-count className="text-[3.4cqw] italic text-parchment/80">
              A kaland kezdetéig
            </p>
            <div data-count role="timer" className="flex items-start gap-[2cqw]">
              <Tile value={pad(t.days)} label="nap" />
              <Tile value={pad(t.hours)} label="óra" />
              <Tile value={pad(t.minutes)} label="perc" />
              <Tile value={pad(t.seconds)} label="mp" valueRef={secRef} />
            </div>
            <button
              data-count
              type="button"
              disabled={!t.done}
              className={`rounded-full px-[9cqw] py-[2.2cqw] font-display text-[4.2cqw] font-bold tracking-wide transition-[background,box-shadow,color,border-color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light ${
                t.done
                  ? "cursor-pointer bg-linear-to-b from-gold-light via-gold to-gold-dark text-night shadow-[0_0_28px_rgba(233,185,92,0.6)]"
                  : "cursor-not-allowed border border-gold/40 bg-night/60 text-parchment/55"
              }`}
            >
              Start
            </button>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
