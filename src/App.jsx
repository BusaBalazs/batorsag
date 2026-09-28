import { useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import CountdownPage from "./components/CountdownPage.jsx";

export default function App() {
  const [page, setPage] = useState("landing");

  if (page === "countdown") {
    return <CountdownPage />;
  }
  return (
    <LandingPage
      onEnter={() => {
        window.scrollTo(0, 0);
        setPage("countdown");
      }}
    />
  );
}
