import Fireflies from "./Fireflies.jsx";

/** Mobilos játékkeret: középre igazított, max. 480 px széles oszlop a háttérképpel. */
export default function GameShell({ children }) {
  return (
    <div className="game-outer min-h-dvh">
      <div className="game-shell mx-auto grid min-h-dvh w-full max-w-[480px] grid-cols-[minmax(0,1fr)] overflow-hidden">
        <Fireflies />
        <div
          className="flex min-h-0 min-w-0 flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
          style={{ gridArea: "1 / 1" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
