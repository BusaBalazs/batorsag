import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import QrScanner from "qr-scanner";
import { reduced } from "../lib/motion.js";

const ERRORS = {
  NotAllowedError:
    "A kamera használata nincs engedélyezve. Engedélyezd a böngésző beállításaiban, vagy olvasd be a kódot a telefonod saját kamerájával.",
  NotFoundError: "Nem találunk kamerát ezen az eszközön. Olvasd be a kódot a telefonod saját kamerájával.",
  NoCameraError: "Nem találunk kamerát ezen az eszközön. Olvasd be a kódot a telefonod saját kamerájával.",
  default:
    "A kamerát nem sikerült elindítani. Olvasd be a kódot a telefonod saját kamerájával, és nyisd meg a linket.",
};

/** Beépített QR-olvasó (kamera). Az első felismert QR-kód tartalmát átadja az onResult-nak. */
export default function ScannerView({ onResult, onCancel }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onCancelRef = useRef(onCancel);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  onResultRef.current = onResult;
  onCancelRef.current = onCancel;

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!ready || reduced()) return undefined;
    const frame = frameRef.current;
    const line = frame?.querySelector("[data-line]");
    if (!frame || !line) return undefined;

    const minY = 6;
    const maxY = Math.max(minY, frame.clientHeight - line.offsetHeight - 6);
    const tween = gsap.fromTo(
      line,
      { y: minY },
      { y: maxY, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
    return () => {
      tween.kill();
      gsap.set(line, { clearProps: "transform" });
    };
  }, [ready]);

  useEffect(() => {
    let stopped = false;
    let decoded = false;
    let scanner;

    const startScanner = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError(ERRORS.default);
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (stopped) return;
        if (devices.length && !devices.some((device) => device.kind === "videoinput")) {
          setError(ERRORS.NoCameraError);
          return;
        }

        scanner = new QrScanner(
          video,
          (result) => {
            if (stopped || decoded) return;
            decoded = true;
            
            scanner.stop();
            onResultRef.current(result.data);
          },
          {
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        );

        await scanner.start();
        if (!stopped) setReady(true);
      } catch (e) {
        if (!stopped) setError(ERRORS[e?.name] ?? ERRORS.default);
      }
    };

    startScanner();

    return () => {
      stopped = true;
      scanner?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="flex flex-1 flex-col items-center justify-center gap-5">
      <h2 data-in className="text-center font-display text-2xl font-bold text-gold-light">
        Olvasd be a QR-kódot
      </h2>

      <div
        data-in
        ref={frameRef}
        className="panel relative isolate grid aspect-square w-full max-w-sm overflow-hidden !rounded-3xl !border-[3px] !border-gold"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          playsInline
          muted
        />
        {ready && (
          <div
            data-line
            className="absolute left-0 top-0 z-10 h-1 w-full rounded-full bg-linear-to-r from-transparent via-gold-light to-transparent shadow-[0_0_14px_3px_rgba(246,220,154,0.9)]"
          />
        )}
        {!ready && !error && (
          <p className="place-self-center px-6 text-center text-parchment/80" style={{ gridArea: "1 / 1" }}>
            Kamera indítása…
          </p>
        )}
        {error && (
          <p className="place-self-center px-6 text-center leading-relaxed text-parchment" style={{ gridArea: "1 / 1" }} role="alert">
            {error}
          </p>
        )}
      </div>

      <p data-in className="max-w-xs text-center text-sm leading-relaxed text-parchment/80">
        Tartsd a kamerát a térképen jelölt helyen lévő QR-kód elé.
      </p>

      <button data-in type="button" className="btn-ghost" onClick={() => onCancelRef.current()}>
        Mégse
      </button>
    </div>
  );
}
