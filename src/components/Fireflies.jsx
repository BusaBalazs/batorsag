import { useEffect, useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion.js";

/** Aranyszínű szentjánosbogarak a háttérben – egyetlen canvas, a GSAP tickerével animálva. */
export default function Fireflies({ count = 22 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reduced()) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const flies = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.2 + Math.random() * 2.4,
      vy: 0.004 + Math.random() * 0.012,
      sway: 6 + Math.random() * 18,
      speed: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.35,
    }));

    const tick = (_, dt) => {
      t += dt / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const f of flies) {
        f.y -= f.vy * (dt / 1000);
        if (f.y < -0.05) {
          f.y = 1.05;
          f.x = Math.random();
        }
        const px = f.x * w + Math.sin(t * f.speed + f.phase) * f.sway;
        const py = f.y * h;
        const a = 0.25 + 0.75 * Math.abs(Math.sin(t * f.speed * 1.4 + f.phase));
        const R = f.r * 5;
        const g = ctx.createRadialGradient(px, py, 0, px, py, R);
        const c = f.warm ? "255, 214, 120" : "170, 215, 255";
        g.addColorStop(0, `rgba(${c}, ${a})`);
        g.addColorStop(0.35, `rgba(${c}, ${a * 0.35})`);
        g.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, R, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [count]);

  // A canvas a saját rácscellájában, a tartalom mögött ül; az `absolute` itt indokolt:
  // a dísz-canvas mérete nem befolyásolhatja az oldal elrendezését.
  return (
    <div aria-hidden="true" className="pointer-events-none relative min-h-0 min-w-0 overflow-hidden" style={{ gridArea: "1 / 1" }}>
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  );
}
