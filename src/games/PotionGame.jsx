import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import cauldronSrc from "../assets/potion/cauldron.webp";
import blueSrc from "../assets/potion/blue.webp";
import greenSrc from "../assets/potion/green.webp";
import lilacSrc from "../assets/potion/lilac.webp";
import yellowSrc from "../assets/potion/yellow.webp";
import { POTION_RECIPE } from "../data/potion.js";
import { POTION_GAME, CORRECT_ANSWER_DELAY_MS } from "../config.js";
import { reduced } from "../lib/motion.js";

const BOTTLES = {
  yellow: { src: yellowSrc, label: "Sárga üvegcse", glow: "#ffd23f" },
  blue: { src: blueSrc, label: "Kék üvegcse", glow: "#3d8bff" },
  green: { src: greenSrc, label: "Zöld üvegcse", glow: "#3ddc84" },
  lilac: { src: lilacSrc, label: "Lila üvegcse", glow: "#b46bff" },
};
const WRONG_RESET_MS = 1800; // rossz sorrend után ennyi idő múlva kezdődik elölről a főzés

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Egy üvegcse: húzható az üstbe, vagy egy koppintással beleszórható. */
function Bottle({ id, locked, hitTest, onHover, onDrop }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const info = BOTTLES[id];

  const home = () =>
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.6)",
      onComplete: () => (ref.current.style.zIndex = ""),
    });

  const onDown = (e) => {
    if (locked()) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
    gsap.killTweensOf(ref.current);
    ref.current.style.zIndex = 40;
    gsap.to(ref.current, { scale: 1.15, duration: 0.15 });
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 8) d.moved = true;
    gsap.set(ref.current, { x: dx, y: dy });
    onHover(hitTest(e.clientX, e.clientY));
  };
  const onUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    onHover(false);
    if (!d.moved || hitTest(e.clientX, e.clientY)) onDrop(id, ref.current);
    else home();
  };
  const onCancel = () => {
    if (!drag.current) return;
    drag.current = null;
    onHover(false);
    home();
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={info.label}
      data-bottle={id}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !locked()) {
          e.preventDefault();
          onDrop(id, ref.current);
        }
      }}
      className="relative w-[21%] max-w-[84px] cursor-grab touch-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <img src={info.src} alt="" draggable="false" className="pointer-events-none block w-full drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)]" />
    </div>
  );
}

/**
 * Bájitalfőzés: felugró ablakban a verses recept, majd az üst és négy üvegcse. Az üvegcséket a recept
 * sorrendjében kell az üstbe dobni (húzással vagy koppintással); rossz sorrendnél elölről kezdődik.
 * A recept és a helyes sorrend: src/data/potion.js
 */
export default function PotionGame({ onComplete }) {
  const order = POTION_RECIPE.order;
  const [started, setStarted] = useState(false);
  const [added, setAdded] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | wrong | done
  const [hover, setHover] = useState(false);
  const [tray] = useState(() => shuffle(order));

  const dialogRef = useRef(null);
  const cauldronRef = useRef(null);
  const glowRef = useRef(null);
  const addedRef = useRef([]);
  const busy = useRef(false);
  const lock = useRef(null); // "wrong" | "done": amíg tart, nem lehet új üvegcsét dobni
  const timers = useRef([]);

  // A recept felugró ablak a játék elején magától megnyílik
  useEffect(() => {
    const d = dialogRef.current;
    if (!d.open) d.showModal();
    if (!reduced()) gsap.fromTo(d, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.7)" });
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  const hitTest = (x, y) => {
    const r = cauldronRef.current?.getBoundingClientRect();
    if (!r) return false;
    const dx = (x - (r.left + r.width * 0.5)) / (r.width * 0.44);
    const dy = (y - (r.top + r.height * 0.5)) / (r.height * 0.44);
    return dx * dx + dy * dy <= 1;
  };

  const flash = (color, big) => {
    if (reduced()) return;
    const el = glowRef.current;
    el.style.setProperty("--glow", color);
    gsap.fromTo(el, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: big ? 1.25 : 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" });
    gsap.fromTo(cauldronRef.current, { scale: 1 }, { scale: 1.03, duration: 0.12, yoyo: true, repeat: 1 });
  };

  // Az üvegcse beleért az üstbe: kiértékeljük a sorrendet
  const land = (id) => {
    const expected = order[addedRef.current.length];
    if (id === expected) {
      const next = [...addedRef.current, id];
      addedRef.current = next;
      setAdded(next);
      if (next.length === order.length) {
        lock.current = "done";
        setStatus("done");
        flash("#ffd23f", true);
        timers.current.push(setTimeout(onComplete, CORRECT_ANSWER_DELAY_MS));
      } else {
        flash(BOTTLES[id].glow);
      }
    } else {
      lock.current = "wrong";
      setStatus("wrong");
      flash("#ff3b3b", true);
      if (!reduced()) gsap.fromTo(cauldronRef.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1.2, 0.25)" });
      timers.current.push(
        setTimeout(() => {
          addedRef.current = [];
          setAdded([]);
          setStatus("idle");
          lock.current = null;
          busy.current = false;
        }, WRONG_RESET_MS)
      );
    }
  };

  // Az üvegcse az üst fölé repül, megbillen, kiürül, majd visszatér a helyére
  const pour = (id, el) => {
    if (busy.current) return;
    busy.current = true;
    const c = cauldronRef.current.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height * 0.45;
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    const fast = reduced();
    gsap
      .timeline()
      .to(el, {
        x: `+=${cx - bx}`,
        y: `+=${cy - by - b.height * 0.7}`,
        rotation: bx <= cx ? 105 : -105,
        scale: 1,
        duration: fast ? 0 : 0.4,
        ease: "power2.out",
      })
      .add(() => land(id))
      .to(el, { opacity: 0, scale: 0.6, duration: fast ? 0 : 0.25, delay: fast ? 0 : 0.25 })
      .set(el, { x: 0, y: 0, rotation: 0, scale: 1 })
      .to(el, {
        opacity: 1,
        duration: fast ? 0 : 0.3,
        onComplete: () => {
          el.style.zIndex = "";
          if (!lock.current) busy.current = false;
        },
      });
  };

  const message =
    status === "done"
      ? "A főzet elkészült! ✨"
      : status === "wrong"
        ? "Rossz sorrend! A főzet elromlott, kezdd újra az elejéről."
        : added.length === 0
          ? "Húzd az üvegcséket az üstbe a recept sorrendjében!"
          : "Jól van, jöhet a következő hozzávaló!";

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      {started && (
        <>
          <div className="text-center">
            <h2 className="gold-text font-display text-2xl font-bold">Bájitalfőzés</h2>
            <div className="mt-2 flex justify-center gap-3" role="status" aria-label={`${added.length} / ${order.length} hozzávaló`}>
              {order.map((_, i) => {
                const id = added[i];
                return (
                  <span
                    key={i}
                    data-slot={id ? "filled" : "empty"}
                    className="size-7 rounded-full border-2 transition-colors duration-300"
                    style={
                      id
                        ? { background: `radial-gradient(circle at 35% 30%, #ffffffaa, ${BOTTLES[id].glow})`, borderColor: "#fff3c8", boxShadow: `0 0 12px ${BOTTLES[id].glow}` }
                        : { background: "rgba(5,13,28,0.6)", borderColor: "rgba(233,185,92,0.4)" }
                    }
                  />
                );
              })}
            </div>
            <p className={`mt-2 min-h-10 text-sm leading-snug ${status === "wrong" ? "text-[#ff9a9a]" : "text-parchment/85"}`} aria-live="polite">
              {message}
            </p>
          </div>

          <div
            ref={cauldronRef}
            className={`panel mx-auto grid overflow-hidden !rounded-3xl transition-shadow duration-300 ${hover ? "!shadow-[0_0_0_4px_rgba(246,220,154,0.9),0_0_40px_rgba(246,220,154,0.7)]" : ""}`}
            style={{ aspectRatio: "940 / 900", width: "min(100%, calc((100svh - 25rem) * 1.0444))" }}
          >
            <img
              src={cauldronSrc}
              alt="Bájitalfőző üst"
              draggable="false"
              className="size-full object-cover"
              style={{ gridArea: "1 / 1", objectPosition: "50% 42.7%" }}
            />
            <div
              ref={glowRef}
              className="pointer-events-none self-start justify-self-start rounded-full"
              style={{
                gridArea: "1 / 1",
                marginLeft: "22.5%",
                marginTop: "14.9%",
                width: "58.5%",
                aspectRatio: "1 / 1.02",
                background: "radial-gradient(closest-side, var(--glow, #ffd23f), transparent 72%)",
                mixBlendMode: "screen",
                opacity: 0,
              }}
            />
          </div>

          <div className="panel flex items-end justify-around gap-1 px-2 py-3">
            {tray.map((id) => (
              <Bottle key={id} id={id} locked={() => busy.current} hitTest={hitTest} onHover={setHover} onDrop={pour} />
            ))}
          </div>

          {POTION_GAME.allowRecipeReread && (
            <button type="button" className="btn-ghost mx-auto !px-4 !py-2 !text-sm" onClick={() => dialogRef.current.showModal()}>
              📜 Recept
            </button>
          )}
        </>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setStarted(true)}
        className="m-auto max-h-[92svh] w-[min(94vw,28rem)] overflow-y-auto rounded-3xl border-[3px] border-gold bg-linear-to-b from-[#3a2412] to-[#150b05] p-6 text-parchment shadow-[0_0_50px_rgba(233,185,92,0.45)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <h2 className="gold-text mb-4 text-center font-display text-2xl font-bold">{POTION_RECIPE.title}</h2>
        <div className="space-y-3 text-center text-[1.02rem] italic leading-relaxed">
          {POTION_RECIPE.poem.map((couplet, i) => (
            <p key={i}>
              {couplet[0]}
              <br />
              {couplet[1]}
            </p>
          ))}
        </div>
        <div className="my-4 h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
        <p className="mb-5 text-center text-[0.95rem] leading-relaxed text-parchment/90">{POTION_RECIPE.howTo}</p>
        <button type="button" className="btn-gold w-full" onClick={() => dialogRef.current.close()}>
          {started ? "Vissza a főzéshez" : POTION_RECIPE.startButton}
        </button>
      </dialog>
    </div>
  );
}
