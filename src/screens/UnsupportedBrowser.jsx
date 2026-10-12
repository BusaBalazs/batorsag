import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import GameShell from "../components/GameShell.jsx";
import { reduced } from "../lib/motion.js";

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* tartalék módszer alább */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function UnsupportedBrowser() {
  const rootRef = useRef(null);
  const linkRef = useRef(null);
  const [copied, setCopied] = useState(null); // null | true | false

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { opacity: 0, y: 26, duration: 0.7, stagger: 0.12, ease: "power3.out" });
      gsap.to("[data-warn-icon]", { rotate: 8, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleCopy = async () => {
    const ok = await copyText(window.location.href);
    setCopied(ok);
    if (!ok) linkRef.current?.select();
    if (!reduced()) gsap.fromTo("[data-result]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <GameShell>
      <div ref={rootRef} className="flex flex-1 flex-col justify-center">
        <div className="panel flex flex-col items-center gap-4 p-7 text-center">
          <div data-in data-warn-icon className="text-6xl" aria-hidden="true">
            🦉
          </div>
          <h1 data-in className="gold-text font-display text-3xl font-bold leading-tight">
            Nem támogatott böngészőt használsz
          </h1>
          <p data-in className="text-lg leading-relaxed text-parchment/90">
            A játék ebben a beágyazott (in-app) böngészőben nem működik megfelelően.
          </p>

          <input
            data-in
            ref={linkRef}
            readOnly
            value={typeof window !== "undefined" ? window.location.href : ""}
            onFocus={(e) => e.target.select()}
            aria-label="Az alkalmazás linkje"
            className="w-full rounded-xl border border-gold/40 bg-night/70 px-3 py-2 text-center text-sm text-parchment/80"
          />

          <button data-in type="button" className="btn-gold w-full" onClick={handleCopy}>
            Link másolása
          </button>

          <div className="min-h-20" aria-live="polite">
            {copied === true && (
              <p data-result className="text-lg font-semibold leading-relaxed text-gold-light">
                ✓ A link a vágólapra került. Másold be egy népszerű böngészőbe (pl. Chrome, Safari), és ott futtasd az
                alkalmazást.
              </p>
            )}
            {copied === false && (
              <p data-result className="text-base leading-relaxed text-[#ff9a9a]">
                A másolás nem sikerült. Nyomd hosszan a fenti linket, másold ki kézzel, majd illeszd be egy népszerű
                böngészőbe (pl. Chrome, Safari).
              </p>
            )}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
