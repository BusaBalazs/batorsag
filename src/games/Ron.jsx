import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { stationTexts } from "../data/stationTexts.js";
import { reduced } from "../lib/motion.js";
import PlaceholderGame from "./PlaceholderGame.jsx";

export default function Ron({ station, onComplete }) {
  const content = stationTexts[station.id];
  const rootRef = useRef(null);
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    if (reduced() || !content) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", {
        opacity: 0,
        y: 22,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [content]);

  if (!content)
    return <PlaceholderGame station={station} onComplete={onComplete} />;

  const openConfirm = () => {
    const d = dialogRef.current;
    d.showModal();
    if (!reduced())
      gsap.fromTo(
        d,
        { scale: 0.75, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" },
      );
  };

  return (
    <div ref={rootRef} className="flex flex-1 flex-col justify-center gap-4">
      <div className="panel flex flex-col gap-4 p-6">
        <h2
          data-in
          className="gold-text text-center font-display text-2xl font-bold leading-snug"
        >
          {content.headline}
        </h2>
        <div
          data-in
          className="space-y-3 text-[1.02rem] leading-relaxed text-parchment/90"
        >
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <button
          data-in
          type="button"
          className="btn-gold mt-1 w-full"
          onClick={openConfirm}
        >
          {content.buttonLabel}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClick={(e) =>
          e.target === dialogRef.current && dialogRef.current.close()
        }
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border-[3px] border-gold bg-linear-to-b from-[#12315e] to-[#071427] p-6 text-center text-parchment shadow-[0_0_50px_rgba(233,185,92,0.4)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <p className="mb-6 font-display text-xl font-semibold leading-snug text-gold-light">
          {content.confirmText}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn-gold w-full"
            onClick={() => {
              dialogRef.current.close();
              onComplete();
            }}
          >
            {content.confirmYes}
          </button>
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => dialogRef.current.close()}
          >
            {content.confirmNo}
          </button>
        </div>
      </dialog>
    </div>
  );
}
