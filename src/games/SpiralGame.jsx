import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import spiralSrc from "../assets/spiral.webp";
import wandSrc from "../assets/wand.webp";
import { SPIRAL_PATH, SPIRAL_IMAGE, SPIRAL_VIEW } from "./spiralPath.js";
import { SPIRAL_GAME, CORRECT_ANSWER_DELAY_MS } from "../config.js";

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const N = SPIRAL_PATH.length / 2; // az útvonal pontjainak száma

/**
 * Varázsspirál: az ujjal végig kell követni a spirált a közepétől kifelé, a varázspálca a kötött
 * pályán halad, a hegye mindig a spirál vonalán van.
 *
 * Technika (a lehető legszélesebb támogatottságért): sima Canvas 2D + Pointer Events (egér, érintés,
 * toll ugyanazzal a kóddal), a spirál útvonala előre kiszámolt pontlista – nincs WebGL, nincs SVG-geometria.
 * Az érintésből csak a megtett út számít: a haladás egy indexet léptet előre az útvonalon, ha az ujj
 * a pálya közelében van, a jelenlegi pozíció előtti/mögötti kis ablakban. Így lerövidíteni sem lehet.
 */
export default function SpiralGame({ onComplete }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(0);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | off (az ujj lecsúszott a vonalról) | done

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const spiralImg = new Image();
    spiralImg.src = spiralSrc;
    const wandImg = new Image();
    wandImg.src = wandSrc;

    const g = {
      w: 0,
      h: 0,
      scale: 1,
      pts: new Float32Array(N * 2), // az útvonal a vászon képpontjaiban
      spacing: 4, // két szomszédos pont átlagos távolsága (px)
      tol: 28,
      idx: 0, // a tényleges haladás (az útvonal indexe)
      disp: 0, // a megjelenített, finoman követő érték
      down: false,
      off: false,
      done: false,
      pct: 0,
      status: "idle",
      t: 0,
      bx: 0.8, // egységvektor a pálca hegyétől a végéig
      by: 0.6,
      particles: [],
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.w = rect.width;
      g.h = rect.height;
      g.scale = g.w / SPIRAL_VIEW.width;
      canvas.width = Math.round(g.w * dpr);
      canvas.height = Math.round(g.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let len = 0;
      for (let i = 0; i < N; i++) {
        g.pts[2 * i] = (SPIRAL_PATH[2 * i] * SPIRAL_IMAGE.width - SPIRAL_VIEW.x) * g.scale;
        g.pts[2 * i + 1] = (SPIRAL_PATH[2 * i + 1] * SPIRAL_IMAGE.height - SPIRAL_VIEW.y) * g.scale;
        if (i) len += Math.hypot(g.pts[2 * i] - g.pts[2 * i - 2], g.pts[2 * i + 1] - g.pts[2 * i - 1]);
      }
      g.spacing = len / (N - 1);
      g.tol = (SPIRAL_GAME.tolerance / 100) * g.w;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const spark = (x, y, count, speed = 60) => {
      for (let i = 0; i < count && g.particles.length < 160; i++) {
        const a = rand(0, TAU);
        const s = rand(10, speed);
        g.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: rand(1.2, 2.2), size: rand(1.5, 3.5) });
      }
    };

    const tipAt = (v) => {
      const i = Math.min(N - 2, Math.max(0, Math.floor(v)));
      const f = Math.min(1, v - i);
      return [
        g.pts[2 * i] + (g.pts[2 * i + 2] - g.pts[2 * i]) * f,
        g.pts[2 * i + 1] + (g.pts[2 * i + 3] - g.pts[2 * i + 1]) * f,
      ];
    };

    // Az érintés feldolgozása: csak az útvonalon előre haladás számít
    const touchAt = (px, py) => {
      if (g.done) return;
      const ahead = Math.ceil((g.tol * 2) / g.spacing);
      const back = Math.ceil(g.tol / g.spacing);
      const lo = Math.max(0, g.idx - back);
      const hi = Math.min(N - 1, g.idx + ahead);
      let best = -1;
      let bestD = Infinity;
      for (let i = lo; i <= hi; i++) {
        const d = Math.hypot(px - g.pts[2 * i], py - g.pts[2 * i + 1]);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      g.off = bestD > g.tol;
      if (!g.off && best > g.idx) {
        g.idx = best;
        const [tx, ty] = tipAt(g.idx);
        spark(tx, ty, 3);
        if (g.idx >= ((N - 1) * SPIRAL_GAME.completePercent) / 100) {
          g.idx = N - 1;
          g.done = true;
          g.off = false;
          g.status = "done";
          const [ex, ey] = tipAt(N - 1);
          spark(ex, ey, 70, 220);
          setStatus("done");
          timer.current = window.setTimeout(onComplete, CORRECT_ANSWER_DELAY_MS);
        }
      }
    };

    const pointFrom = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onDown = (e) => {
      g.down = true;
      canvas.setPointerCapture?.(e.pointerId);
      touchAt(...pointFrom(e));
    };
    const onMove = (e) => {
      if (!g.down) return;
      // a gyors húzás közbülső pontjait is feldolgozzuk, hogy ne maradjon ki szakasz
      const list = e.getCoalescedEvents?.();
      for (const ev of list && list.length ? list : [e]) touchAt(...pointFrom(ev));
    };
    const onUp = () => {
      g.down = false;
      g.off = false;
    };
    const stop = (e) => e.preventDefault();
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("contextmenu", stop);

    const tick = (_, deltaTime) => {
      const dt = Math.min(deltaTime, 50) / 1000;
      g.t += dt;
      const { w, h } = g;

      g.disp += (g.idx - g.disp) * Math.min(1, dt * 14);
      if (Math.abs(g.idx - g.disp) < 0.01) g.disp = g.idx;
      const [tx, ty] = tipAt(g.disp);

      // A pálca: a hegye a vonalon, a vége a spirál egy korábbi pontja felé néz (húr), így simul rá a spirálra
      const wandLen = w * 0.5;
      let j = Math.floor(g.disp);
      let far = j;
      let farD = 0;
      for (; j >= 0; j--) {
        const d = Math.hypot(g.pts[2 * j] - tx, g.pts[2 * j + 1] - ty);
        if (d > farD) {
          farD = d;
          far = j;
        }
        if (d >= wandLen * 0.92) break;
      }
      if (farD > 6) {
        const nx = (g.pts[2 * far] - tx) / farD;
        const ny = (g.pts[2 * far + 1] - ty) / farD;
        const k = Math.min(1, dt * 12);
        g.bx += (nx - g.bx) * k;
        g.by += (ny - g.by) * k;
        const m = Math.hypot(g.bx, g.by) || 1;
        g.bx /= m;
        g.by /= m;
      }

      // állapot a felületnek (csak változáskor)
      const pc = Math.round((100 * g.idx) / (N - 1));
      if (pc !== g.pct) {
        g.pct = pc;
        setPercent(pc);
      }
      if (!g.done) {
        const next = g.off && g.down ? "off" : "idle";
        if (next !== g.status) {
          g.status = next;
          setStatus(next);
        }
      }

      // ── rajzolás ──
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      if (spiralImg.complete && spiralImg.naturalWidth) {
        ctx.drawImage(spiralImg, SPIRAL_VIEW.x, SPIRAL_VIEW.y, SPIRAL_VIEW.width, SPIRAL_VIEW.height, 0, 0, w, h);
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.42)"; // a még be nem járt spirál halványabb
      ctx.fillRect(0, 0, w, h);

      // a bejárt szakasz fénynyoma
      const upto = Math.floor(g.disp);
      if (upto > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const passes = [
          [20, "rgba(255, 150, 30, 0.22)"],
          [9, "rgba(255, 200, 80, 0.5)"],
          [3.5, "rgba(255, 248, 215, 0.95)"],
        ];
        for (const [lw, color] of passes) {
          ctx.lineWidth = lw * Math.max(0.8, g.scale * 2.4);
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(g.pts[0], g.pts[1]);
          for (let i = 1; i <= upto; i++) ctx.lineTo(g.pts[2 * i], g.pts[2 * i + 1]);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      }

      // induló gyűrű a spirál közepén
      if (g.idx === 0 && !g.done) {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "rgba(255, 224, 140, 0.9)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tx, ty, 14 + 6 * Math.abs(Math.sin(g.t * 3.5)), 0, TAU);
        ctx.stroke();
      }

      // szikrák
      ctx.globalCompositeOperation = "lighter";
      for (const p of g.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = "#ffe9a8";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
      }
      g.particles = g.particles.filter((p) => p.life > 0);
      ctx.globalAlpha = 1;

      // a pálca (a hegye a bal vége a képen)
      ctx.globalCompositeOperation = "source-over";
      if (wandImg.complete && wandImg.naturalWidth) {
        const wh = ((wandLen * wandImg.naturalHeight) / wandImg.naturalWidth) * 1.5; // kicsit vastagabb, hogy jobban látszódjon
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(Math.atan2(g.by, g.bx));
        ctx.shadowColor = "rgba(255, 200, 90, 0.85)";
        ctx.shadowBlur = 10;
        ctx.drawImage(wandImg, 0, -wh / 2, wandLen, wh);
        ctx.restore();
      }

      // a hegy fénye
      ctx.globalCompositeOperation = "lighter";
      const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 18);
      glow.addColorStop(0, "rgba(255, 245, 200, 0.95)");
      glow.addColorStop(1, "rgba(255, 190, 70, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(tx, ty, 18, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      if (g.done && g.disp >= N - 1.5 && g.particles.length === 0) gsap.ticker.remove(tick);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("contextmenu", stop);
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const message =
    status === "done"
      ? "A varázslat sikerült! ✨"
      : status === "off"
        ? "Maradj a spirál vonalán!"
        : percent === 0
          ? "Érintsd meg a spirál közepét, és vezesd az ujjad kifelé a vonalon!"
          : "Így van, folytasd a spirált!";

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className="text-center">
        <h2 className="gold-text font-display text-2xl font-bold">Rajzold meg a varázsspirált!</h2>
        <p
          className={`mt-1 min-h-10 text-sm leading-snug ${status === "off" ? "text-[#ff9a9a]" : "text-parchment/80"}`}
          aria-live="polite"
        >
          {message}
        </p>
        <div
          className="mx-auto mt-1 h-2.5 w-48 overflow-hidden rounded-full border border-gold/40 bg-night/70"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-gold to-gold-light shadow-[0_0_10px_rgba(233,185,92,0.8)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div
        ref={boxRef}
        className="panel mx-auto overflow-hidden !rounded-3xl"
        style={{
          aspectRatio: `${SPIRAL_VIEW.width} / ${SPIRAL_VIEW.height}`,
          // a magasság korlátja mellett is megmarad a kép aránya
          width: `min(100%, calc((100svh - 20rem) * ${SPIRAL_VIEW.width / SPIRAL_VIEW.height}))`,
        }}
      >
        <canvas ref={canvasRef} className="block size-full touch-none select-none" />
      </div>
    </div>
  );
}
