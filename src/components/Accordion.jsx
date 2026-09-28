import { useRef, useState } from "react";
import gsap from "gsap";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lenyitható HTML elem (<details>), a nyitást/zárást GSAP animálja.
 * A `open` attribútumot kézzel kezeljük, hogy a zárás animációja lefusson.
 */
export default function Accordion({ icon, title, defaultOpen = false, children }) {
  const detailsRef = useRef(null);
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = (e) => {
    e.preventDefault();
    const details = detailsRef.current;
    const panel = panelRef.current;
    const duration = prefersReducedMotion() ? 0 : undefined;
    gsap.killTweensOf(panel);

    if (!isOpen) {
      details.open = true;
      setIsOpen(true);
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: duration ?? 0.5,
          ease: "power2.out",
          clearProps: "height,opacity",
        }
      );
    } else {
      setIsOpen(false);
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: duration ?? 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          details.open = false;
          gsap.set(panel, { clearProps: "height,opacity" });
        },
      });
    }
  };

  return (
    <details
      ref={detailsRef}
      open={defaultOpen}
      data-acc
      className={`rounded-2xl border bg-deep/55 backdrop-blur-sm transition-colors duration-500 ${
        isOpen
          ? "border-gold/60 shadow-[0_0_32px_-8px_rgba(233,185,92,0.35)]"
          : "border-gold/25 hover:border-gold/45"
      }`}
    >
      <summary
        onClick={toggle}
        className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          {icon}
        </span>
        <span className="flex-1 font-display text-lg font-semibold leading-snug text-gold-light sm:text-xl">
          {title}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-6 shrink-0 text-gold transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div ref={panelRef} className="overflow-hidden">
        <div className="border-t border-gold/15 px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>
    </details>
  );
}
