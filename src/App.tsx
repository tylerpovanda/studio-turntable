import { useEffect } from "react";
import ReleaseCard from "./components/ReleaseCard";
import Title from "./components/Title";
import Footer from "./components/Footer";
import releases from "./data/releases.json";

function App() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(var(--vh,1vh)*100)] w-full bg-white overflow-x-hidden">
      <Title />

      {/* CENTERED CONTENT */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <ReleaseCard releases={releases} />
      </div>

      <Footer />
    </div>
  );
}

export default App;