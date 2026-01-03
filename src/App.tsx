// import ReleaseCard from "./components/ReleaseCard";
// import releases from "./data/releases.json";
// import Footer from "./components/Footer";
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     const setVh = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };
//     setVh();
//     window.addEventListener("resize", setVh);
//     return () => window.removeEventListener("resize", setVh);
//   }, []);

//   return (
//     <div
//       className="relative min-h-screen bg-white"
//       style={{
//         width: "100vw",       // full viewport width
//         overflowX: "hidden",  // prevent horizontal overflow
//         overflowY: "scroll",  // always reserve vertical scrollbar space
//       }}
//     >
//       {/* Title fixed at top, scales */}
//       <div className="absolute top-8 w-full flex justify-center z-50">
//         {/* Responsive container for the title */}
//         <div className="w-full max-w-xs sm:max-w-md md:max-w-160 px-4 text-center">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-jacquard truncate">
//             tyler povanda
//           </h1>
//           <p className="text-lg sm:text-xl md:text-2xl font-jacquard text-gray-500 truncate">
//             music that i helped make
//           </p>
//         </div>
//       </div>

//       {/* Release Card centered in viewport */}
//       <div className="flex items-center justify-center min-h-screen">
//         <ReleaseCard releases={releases} />
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;

// import { useEffect } from "react";
// import ReleaseCard from "./components/ReleaseCard";
// import releases from "./data/releases.json";
// import Footer from "./components/Footer";
// import Title from "./components/Title";

// function App() {
//   useEffect(() => {
//     const setVh = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };
//     setVh();
//     window.addEventListener("resize", setVh);
//     return () => window.removeEventListener("resize", setVh);
//   }, []);

//   return (
//     <div className="flex flex-col bg-white overflow-x-hidden">
//       <Title />

//       <main className="flex flex-col items-center px-4 mt-4 sm:mt-8 md:flex-1 md:justify-center">
//         <ReleaseCard releases={releases} />
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default App;


// import { useEffect } from "react";
// import ReleaseCard from "./components/ReleaseCard";
// import releases from "./data/releases.json";
// import Footer from "./components/Footer";
// import Title from "./components/Title";

// function App() {
//   useEffect(() => {
//     const setVh = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };
//     setVh();
//     window.addEventListener("resize", setVh);
//     return () => window.removeEventListener("resize", setVh);
//   }, []);

//   return (
//     // <div className="flex flex-col min-h-screen">
//     <div
//   className="relative bg-white"
//   style={{
//     width: "100vw",
//     minHeight: "calc(var(--vh, 1vh) * 100)",
//     overflowX: "hidden",
//   }}
// >
//       <Title />
//       <div className="w-full flex-1 md:flex md:items-center md:justify-center md:py-4">
//         <div className="md:-translate-y-20">
//           <ReleaseCard releases={releases} />
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default App;


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
    <div className="w-full min-h-screen bg-white flex flex-col">
  <Title />

  {/* Desktop: flex layout */}
  <div className="hidden md:flex-1 md:flex md:flex-col md:justify-center md:items-center">
    <ReleaseCard releases={releases} />
  </div>

  {/* Mobile: absolute vertical centering */}
  <div className="md:hidden relative w-full">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
      <ReleaseCard releases={releases} />
    </div>
  </div>

  <Footer />
</div>

  );
}

export default App;
