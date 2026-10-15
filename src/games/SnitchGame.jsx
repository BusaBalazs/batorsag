import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import snitchSrc from "../assets/snitch.png";
import { SNITCH_GAME, CORRECT_ANSWER_DELAY_MS } from "../config.js";

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);

const SNITCH_WIDTH = 110; // a cikesz rajzolt szélessége (px)
const SNITCH_HIT_PADDING = 14; // ennyivel nagyobb a találati zóna, mint a cikesz, hogy ujjal is könnyű legyen
const RESPAWN_DELAY = 0.35; // mp-ben: ennyi idő után bukkan fel a következő cikesz

const COLORS = [
  { light: "#ff7a7a", dark: "#a31419" }, // piros
  { light: "#5ff0a0", dark: "#146338" }, // zöld
];

/** Véletlenszerűen cikázó elem: időnként irányt és sebességet vált, a pálya szélén visszapattan. */
function wander(e, dt, w, h, speed, turnMin, turnMax) {
  e.turnIn -= dt;
  if (e.turnIn <= 0) {
    const a = rand(0, TAU);
    const sp = speed * rand(0.7, 1.3);
    e.vx = Math.cos(a) * sp;
    e.vy = Math.sin(a) * sp;
    e.turnIn = rand(turnMin, turnMax);
  }
  e.x += e.vx * dt;
  e.y += e.vy * dt;
  if (e.x < e.r) {
    e.x = e.r;
    e.vx = Math.abs(e.vx);
  } else if (e.x > w - e.r) {
    e.x = w - e.r;
    e.vx = -Math.abs(e.vx);
  }
  if (e.y < e.r) {
    e.y = e.r;
    e.vy = Math.abs(e.vy);
  } else if (e.y > h - e.r) {
    e.y = h - e.r;
    e.vy = -Math.abs(e.vy);
  }
}

function makeCircle(w, h, i) {
  const r = rand(16, 30);
  return { x: rand(r, w - r), y: rand(r, h - r), r, vx: 0, vy: 0, turnIn: 0, color: COLORS[i % 2] };
}

/** Cikeszvadászat: koppints az arany cikeszre a piros és zöld körök között. Egyszerre csak egy cikesz látszik. */
export default function SnitchGame({ onComplete }) {
  const { snitchesToCatch, snitchSpeed, circleSpeed, circleCount } = SNITCH_GAME;
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(0);
  const [caught, setCaught] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = snitchSrc;

    const g = { w: 0, h: 0, circles: [], snitch: null, bursts: [], respawnIn: 0, caught: 0, t: 0 };

    const spawnSnitch = (avoid) => {
      const r = SNITCH_WIDTH * 0.4;
      let x;
      let y;
      let tries = 0;
      do {
        x = rand(r, g.w - r);
        y = rand(r, g.h - r);
      } while (avoid && Math.hypot(x - avoid.x, y - avoid.y) < 140 && ++tries < 20);
      g.snitch = { x, y, r, vx: 0, vy: 0, turnIn: 0, appear: 0 };
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.w = rect.width;
      g.h = rect.height;
      canvas.width = Math.round(g.w * dpr);
      canvas.height = Math.round(g.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!g.circles.length) {
        g.circles = Array.from({ length: circleCount }, (_, i) => makeCircle(g.w, g.h, i));
        spawnSnitch();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const burst = (x, y) => {
      for (let i = 0; i < 22; i++) {
        const a = rand(0, TAU);
        const sp = rand(80, 260);
        g.bursts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, size: rand(2, 5) });
      }
    };

    const onPointerDown = (e) => {
      const s = g.snitch;
      if (!s || g.caught >= snitchesToCatch) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (Math.hypot(px - s.x, py - s.y) > s.r + SNITCH_HIT_PADDING) return;

      burst(s.x, s.y);
      g.snitch = null;
      g.caught += 1;
      setCaught(g.caught);
      if (g.caught >= snitchesToCatch) {
        timer.current = window.setTimeout(onComplete, CORRECT_ANSWER_DELAY_MS);
      } else {
        g.respawnIn = RESPAWN_DELAY;
        g.lastCatch = { x: s.x, y: s.y };
      }
    };
    canvas.addEventListener("pointerdown", onPointerDown);

    const tick = (_, deltaTime) => {
      const dt = Math.min(deltaTime, 50) / 1000;
      g.t += dt;
      const { w, h } = g;

      for (const c of g.circles) wander(c, dt, w, h, circleSpeed, 0.5, 1.6);

      if (g.snitch) {
        wander(g.snitch, dt, w, h, snitchSpeed, 0.18, 0.5); // gyakori irányváltás = cikázás
        g.snitch.appear = Math.min(1, g.snitch.appear + dt / 0.25);
      } else if (g.caught < snitchesToCatch) {
        g.respawnIn -= dt;
        if (g.respawnIn <= 0) spawnSnitch(g.lastCatch);
      }

      for (const b of g.bursts) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt * 1.8;
      }
      g.bursts = g.bursts.filter((b) => b.life > 0);

      // ── rajzolás ──
      ctx.clearRect(0, 0, w, h);
      for (const c of g.circles) {
        const grad = ctx.createRadialGradient(c.x - c.r * 0.3, c.y - c.r * 0.3, c.r * 0.1, c.x, c.y, c.r);
        grad.addColorStop(0, c.color.light);
        grad.addColorStop(1, c.color.dark);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const s = g.snitch;
      if (s && img.complete && img.naturalWidth) {
        const sw = SNITCH_WIDTH * s.appear;
        const sh = (sw * img.naturalHeight) / img.naturalWidth;
        const flutter = 1 + Math.sin(g.t * 38) * 0.07; // szárnyrezgés
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate((s.vx / snitchSpeed) * 0.3);
        ctx.shadowColor = "rgba(255, 214, 120, 0.9)";
        ctx.shadowBlur = 18;
        ctx.drawImage(img, (-sw * flutter) / 2, -sh / 2, sw * flutter, sh);
        ctx.restore();
      }

      for (const b of g.bursts) {
        ctx.globalAlpha = Math.max(0, b.life);
        ctx.fillStyle = "#ffe08a";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      canvas.removeEventListener("pointerdown", onPointerDown);
      ro.disconnect();
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = caught >= snitchesToCatch;

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className="text-center">
        <h2 className="gold-text font-display text-2xl font-bold">Kapd el a cikeszt!</h2>
        <p className="mt-1 text-sm text-parchment/80">
          {done ? "Mind elkaptad, ügyes vagy! ✨" : "Koppints a cikeszre, mielőtt elszáll!"}
        </p>
        <div className="mt-2 flex justify-center gap-2" role="status" aria-label={`${caught} / ${snitchesToCatch} elkapva`}>
          {Array.from({ length: snitchesToCatch }, (_, i) => (
            <span
              key={i}
              className={`size-3.5 rotate-45 rounded-[3px] border ${
                i < caught
                  ? "border-gold-light bg-linear-to-b from-gold-light to-gold shadow-[0_0_10px_rgba(233,185,92,0.9)]"
                  : "border-gold/40 bg-night/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={boxRef} className="panel h-[clamp(300px,calc(100svh-21rem),560px)] w-full overflow-hidden">
        <canvas ref={canvasRef} className="block size-full touch-none" />
      </div>
    </div>
  );
}
