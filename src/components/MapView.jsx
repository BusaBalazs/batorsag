import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mapSrc from "../assets/map.webp";
import MapMarker from "./MapMarker.jsx";
import { MAP_ZOOM } from "../config.js";
import { reduced } from "../lib/motion.js";

// A térképablak magassága fix, hogy a méretét egyszer megmérhessük
const VIEW_CLASS = "h-[clamp(280px,calc(100svh-24rem),600px)] w-full overflow-hidden rounded-2xl";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Interaktív térkép: két ujjas nagyítás/kicsinyítés, húzás, +/− gombok, a jelölt állomásra középre igazítva. */
export default function MapView({ station }) {
  const cardRef = useRef(null);
  const viewRef = useRef(null);
  const [box, setBox] = useState(null); // a térképablak mérete (egyszer mérjük)
  const [ratio, setRatio] = useState(null); // a térkép képének szélesség/magasság aránya

  useLayoutEffect(() => {
    const r = viewRef.current.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setRatio(img.naturalWidth / img.naturalHeight);
    img.src = mapSrc;
  }, []);

  // „Felugró” megjelenés
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { scale: 0.75, opacity: 0, y: 40, duration: 0.8, ease: "back.out(1.6)" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const { minPercent, maxPercent, initialPercent, stepPercent } = MAP_ZOOM;
  const minScale = minPercent / 100;
  const maxScale = maxPercent / 100;
  const startScale = clamp(initialPercent / 100, minScale, maxScale);

  let content = null;
  if (box && ratio) {
    // 100% = a térkép „kitölti” az ablakot
    const contentW = Math.max(box.w, box.h * ratio);
    const contentH = contentW / ratio;
    const px = station.map.x / 100;
    const py = station.map.y / 100;
    const place = (viewport, size, p) => {
      const scaled = size * startScale;
      if (scaled <= viewport) return (viewport - scaled) / 2;
      return clamp(viewport / 2 - scaled * p, viewport - scaled, 0);
    };
    const x0 = place(box.w, contentW, px);
    const y0 = place(box.h, contentH, py);

    content = (
      <TransformWrapper
        key={station.id}
        initialScale={startScale}
        initialPositionX={x0}
        initialPositionY={y0}
        minScale={minScale}
        maxScale={maxScale}
        limitToBounds
        centerZoomedOut
        smooth
        doubleClick={{ disabled: true }}
        onTransform={(_, st) => viewRef.current?.style.setProperty("--z", st.scale)}
      >
        {({ zoomIn, zoomOut, setTransform }) => (
          <>
            <div
              ref={viewRef}
              className={VIEW_CLASS}
              style={{ "--z": startScale, touchAction: "none" }}
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: contentW, height: contentH }}
              >
                <div className="relative size-full">
                  <img
                    src={mapSrc}
                    alt="A Rákóczi kert térképe"
                    className="block size-full select-none"
                    draggable="false"
                  />
                  <MapMarker x={station.map.x} y={station.map.y} />
                </div>
              </TransformComponent>
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button type="button" className="icon-btn" aria-label="Kicsinyítés" onClick={() => zoomOut(stepPercent / 100)}>
                −
              </button>
              <button
                type="button"
                className="btn-ghost !px-4 !py-2 !text-sm"
                onClick={() => setTransform(x0, y0, startScale, 500)}
              >
                Vissza a jelölthöz
              </button>
              <button type="button" className="icon-btn" aria-label="Nagyítás" onClick={() => zoomIn(stepPercent / 100)}>
                +
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    );
  }

  return (
    <div ref={cardRef} className="panel flex flex-col p-2.5">
      {box ? content : <div ref={viewRef} className={VIEW_CLASS} />}
    </div>
  );
}
