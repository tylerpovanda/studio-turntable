import ReleaseCard from "./components/ReleaseCard";
import releases from "./data/releases.json";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      className="relative min-h-screen bg-white"
      style={{
        width: "100vw",       // full viewport width
        overflowX: "hidden",  // prevent horizontal overflow
        overflowY: "scroll",  // always reserve vertical scrollbar space
      }}
    >
      {/* Title fixed at top, scales */}
      <div className="absolute top-8 w-full flex justify-center z-50">
        {/* Responsive container for the title */}
        <div className="w-full max-w-xs sm:max-w-md md:max-w-160 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-jacquard truncate">
            tyler povanda
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-jacquard text-gray-500 truncate">
            music that i helped make
          </p>
        </div>
      </div>

      {/* Release Card centered in viewport */}
      <div className="flex items-center justify-center min-h-screen">
        <ReleaseCard releases={releases} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
