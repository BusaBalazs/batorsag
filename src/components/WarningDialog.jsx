import { useEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

/** Figyelmeztető felugró (natív <dialog>): rossz QR-kód beolvasásakor. */
export default function WarningDialog({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) {
      d.showModal();
      if (!reduced()) {
        gsap.fromTo(d, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" });
        gsap.fromTo("[data-warn-icon]", { rotate: -14 }, { rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.3)", delay: 0.15 });
      }
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,26rem)] rounded-3xl border-[3px] border-[#ffb3b3] bg-linear-to-b from-[#7d1620] to-[#3f0a10] p-6 text-center text-parchment shadow-[0_0_50px_rgba(229,56,59,0.55)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div data-warn-icon className="mb-2 text-5xl" aria-hidden="true">
        ⚠️
      </div>
      <h2 className="mb-3 font-display text-2xl font-bold text-white">Rossz kód!</h2>
      <p className="mb-6 text-lg leading-relaxed">
        Rossz kódot olvastál be! Keresd meg a térképen jelzett kódot.
      </p>
      <button type="button" className="btn-gold" onClick={onClose} autoFocus>
        Értem
      </button>
    </dialog>
  );
}
