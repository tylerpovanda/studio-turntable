import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, animate } from "framer-motion";
import vinylImg from "../assets/vinyl.png";

interface Release {
  artist: string;
  title: string;
  year: number;
  role: string;
  artworkUrl: string;
  spotifyUrl?: string;
}

interface ReleaseCardProps {
  releases: Release[];
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ releases }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const [rotateZ, setRotateZ] = useState(0);
  const vinylRef = useRef<HTMLDivElement>(null);
  const rotateZRef = useRef(0);
  const lastAngleRef = useRef<number | null>(null);
  const cumulativeRotationRef = useRef(0);
  const threshold = 90;

  const [contentScale, setContentScale] = useState(1);
  const [contentShiftX, setContentShiftX] = useState(0);
  const [isMobile] = useState(window.innerWidth < 768); // or calculate dynamically in effect
  const mobileHorizontalOffset = -40;

  // 🔊 Scratch sounds
  const scratchCWRef = useRef<HTMLAudioElement | null>(null);
  const scratchCCWRef = useRef<HTMLAudioElement | null>(null);
  // 🔊 UI spin sounds (button-only)
  const spinNextRef = useRef<HTMLAudioElement | null>(null);
  const spinPrevRef = useRef<HTMLAudioElement | null>(null);


  // 📏 Window height
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Wrap in useCallback and include all external dependencies
  const updateContentScale = useCallback(() => {
  const width = window.innerWidth;
  const mobile = width < 434;
  const awkward = width >= 434 && width <768 
  const tablet = width >= 768 && width <= 1024;
  // const desktop = width > 1024;

  const jacketSize = mobile ? 220 : 320;
  const vinylSize = mobile ? 160 : 256;
  const textWidth = 300;
  const margin = 30;

  // Adjust vinyl width for scaling math depending on device
  const vinylFactor = mobile ? 1 : awkward ? 0.9 : tablet ? 1 : 2; 
  const totalContentWidth = jacketSize + vinylSize / vinylFactor + textWidth + margin;

  const maxWidth = width - 32; // leave some padding
  const scale = Math.min(1, maxWidth / totalContentWidth);

  setContentScale(scale);

  // shift for mobile
  const extraSpace = maxWidth - totalContentWidth * scale;
  const mobileShift = Math.min(0, extraSpace / 2 + mobileHorizontalOffset);
  setContentShiftX(mobile ? mobileShift : 0);
}, [mobileHorizontalOffset]);


  // Safe effect
  useEffect(() => {
    // Wrap the state-updating call in requestAnimationFrame
    const frame = requestAnimationFrame(() => updateContentScale());

    const handleResize = () => {
      requestAnimationFrame(() => updateContentScale());
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateContentScale]); // ✅ include updateContentScale

  useEffect(() => {
    // call once safely
    const frame = requestAnimationFrame(() => updateContentScale());

    const handleResize = () => {
        requestAnimationFrame(() => updateContentScale());
        setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // create audio objects
    scratchCWRef.current = new Audio("/sounds/scratch1.wav");
    scratchCCWRef.current = new Audio("/sounds/scratch2.wav");
    scratchCWRef.current.volume = 0.5;
    scratchCCWRef.current.volume = 0.5;

    spinNextRef.current = new Audio("/sounds/spin1.wav");
    spinPrevRef.current = new Audio("/sounds/spin2.wav");
    spinNextRef.current.volume = 0.5;
    spinPrevRef.current.volume = 0.5;

    // iOS unlock workaround: attach a first gesture to allow audio playback
    const unlock = () => {
        // nothing to play, just call .play().catch() on a muted audio to unlock
        scratchCWRef.current?.play().catch(() => {});
        scratchCWRef.current?.pause();
        scratchCWRef.current!.currentTime = 0;

        scratchCCWRef.current?.play().catch(() => {});
        scratchCCWRef.current?.pause();
        scratchCCWRef.current!.currentTime = 0;

        // remove listeners after first interaction
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("pointerdown", unlock, { once: true });

    return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", handleResize);
    };
}, [updateContentScale]);

  

  if (!releases || releases.length === 0) return <div>No releases available</div>;

// If height < 600px, show overlay message
const isDesktop = window.innerWidth >=768;

// if (windowHeight < 740) {
if(isDesktop && windowHeight < 705) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-1 px-4">
      <motion.div
        className="text-center text-black text-2xl font-jacquard"
        animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        please expand the page my friend...
      </motion.div>
      <motion.img
        src="/assets/chevron-64.png"
        className="w-8 h-8"
        animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        alt="downward chevron"
      />
    </div>
  );
}

  const handleNext = (animateVinyl = true) => {
    // 🔊 play button sound
    if (animateVinyl && spinNextRef.current) {
        spinNextRef.current.currentTime = 0;
        spinNextRef.current.play();
    }
    
    setDirection("next");
    setOldIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % releases.length);

    if (animateVinyl) {
      const start = rotateZRef.current;
      const end = start + 360;
      animate(rotateZRef.current, end, {
        duration: 0.8,
        onUpdate: (v) => {
          rotateZRef.current = v;
          setRotateZ(v % 360);
        },
        onComplete: () => {
          rotateZRef.current = 0;
          setRotateZ(0);
        },
      });
    }
  };

  const handlePrev = (animateVinyl = true) => {
    // 🔊 play button sound
    if (animateVinyl && spinPrevRef.current) {
        spinPrevRef.current.currentTime = 0;
        spinPrevRef.current.play();
    }
    
    setDirection("prev");
    setOldIndex(currentIndex);
    setCurrentIndex((prev) =>
      prev === 0 ? releases.length - 1 : prev - 1
    );

    if (animateVinyl) {
      const start = rotateZRef.current;
      const end = start - 360;
      animate(rotateZRef.current, end, {
        duration: 0.8,
        onUpdate: (v) => {
          rotateZRef.current = v;
          setRotateZ(v % 360);
        },
        onComplete: () => {
          rotateZRef.current = 0;
          setRotateZ(0);
        },
      });
    }
  };

  const getCenter = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!vinylRef.current) return;
    vinylRef.current.setPointerCapture(e.pointerId);

    const center = getCenter(vinylRef.current);
    const angle =
      (Math.atan2(e.clientY - center.y, e.clientX - center.x) * 180) / Math.PI;
    lastAngleRef.current = angle;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (lastAngleRef.current === null || !vinylRef.current) return;

    const center = getCenter(vinylRef.current);
    const angle =
      (Math.atan2(e.clientY - center.y, e.clientX - center.x) * 180) / Math.PI;
    let delta = angle - lastAngleRef.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // 🔊 Scratch sounds with feedback fix
    if (Math.abs(delta) > 2) {
      if (delta > 0 && scratchCWRef.current) {
        const audio = scratchCWRef.current;
        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
        }
      } else if (delta < 0 && scratchCCWRef.current) {
        const audio = scratchCCWRef.current;
        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
        }
      }
    }

    rotateZRef.current += delta;
    cumulativeRotationRef.current += delta;
    setRotateZ(rotateZRef.current);

    if (cumulativeRotationRef.current >= threshold) {
      handleNext(false);
      cumulativeRotationRef.current = 0;
      rotateZRef.current = 0;
      setRotateZ(0);
    } else if (cumulativeRotationRef.current <= -threshold) {
      handlePrev(false);
      cumulativeRotationRef.current = 0;
      rotateZRef.current = 0;
      setRotateZ(0);
    }

    lastAngleRef.current = angle;
  };

  const onPointerUp = () => {
    lastAngleRef.current = null;
    cumulativeRotationRef.current = 0;
    animate(rotateZRef.current, 0, {
      duration: 0.3,
      onUpdate: (v) => setRotateZ(v),
      onComplete: () => {
        rotateZRef.current = 0;
      },
    });
  };

  const currentRelease = releases[currentIndex];
  const oldRelease = oldIndex !== null ? releases[oldIndex] : null;

  const jacketSize = isMobile ? 220 : 320;
  const vinylSize = isMobile ? 160 : 256;
  const textMargin = isMobile ? 20 : 30;
  const textOrbitVOffset = isMobile ? -20 : -30;
  const textRestVOffset = isMobile ? 4 : 6;

  const extractTrackId = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
  };

 

  return (
    // <div
    //   className="flex flex-col items-center gap-6 p-4 relative overflow-visible"
    //   style={{
    //     minHeight: "calc(var(--vh, 1vh) * 100)",
    //     justifyContent:
    //       windowHeight >= 900
    //         ? "center"
    //         : windowHeight >= 720
    //         ? "flex-start"
    //         : "center",
    //   }}
    // >

    // this was working
    <div
    className="flex flex-col items-center gap-6 p-4 "
  >
      {/* Release card wrapper */}
      <div
        className="flex flex-col items-center"

      >
        {/* SCALE EVERYTHING */}
        <motion.div
          style={{
            scale: contentScale,
            translateX: contentShiftX,
          }}
          className="flex flex-row items-center gap-6 relative overflow-visible justify-center"
        >
          {/* Album Artwork */}
          <div
            className="relative shrink-0 z-30"
            style={{ width: jacketSize, height: jacketSize }}
          >
            <div className="absolute w-full h-full top-0 left-0 bg-black rounded-lg z-20 select-none" />
            {oldRelease && (
              <motion.img
                key={oldRelease.artworkUrl}
                src={oldRelease.artworkUrl}
                className="absolute w-full h-full object-cover rounded-lg z-30 select-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                draggable={false}
                alt={oldRelease.title}
              />
            )}
            <motion.img
              key={currentRelease.artworkUrl}
              src={currentRelease.artworkUrl}
              className="absolute w-full h-full object-cover rounded-lg shadow-lg z-40 select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              draggable={false}
              alt={currentRelease.title}
            />
          </div>

          {/* Vinyl + Text */}
          <div
            ref={vinylRef}
            className="relative z-10 overflow-visible touch-none"
            style={{
              width: vinylSize,
              height: vinylSize,
              marginLeft: -vinylSize / 2,
              touchAction: "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <motion.img
              src={vinylImg}
              className="absolute w-full h-full object-cover rounded-full shadow-lg select-none"
              style={{ rotate: rotateZ }}
              alt="vinyl record"
            />

            {oldRelease && (
              <motion.div
                key={oldRelease.title}
                style={{
                  position: "absolute",
                  top: `calc(30% + ${textRestVOffset}px)`,
                  left: `${vinylSize + textMargin}px`,
                  transformOrigin: `-${vinylSize}px ${
                    vinylSize / 2 + textOrbitVOffset
                  }px`,
                }}
                initial={{ rotate: 0, opacity: 1 }}
                animate={{
                  rotate: direction === "next" ? 90 : -90,
                  opacity: 0,
                }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => setOldIndex(null)}
                className="flex flex-col gap-2 whitespace-nowrap"
              >
                <span className="text-lg font-bold">{oldRelease.artist}</span>
                <span>{oldRelease.title}</span>
                <span className="text-sm text-gray-400">{oldRelease.year}</span>
                <span className="text-sm text-gray-400">{oldRelease.role}</span>
              </motion.div>
            )}

            <motion.div
              key={currentRelease.title}
              style={{
                position: "absolute",
                top: `calc(30% + ${textRestVOffset}px)`,
                left: `${vinylSize + textMargin}px`,
                transformOrigin: `-${vinylSize}px ${
                  vinylSize / 2 + textOrbitVOffset
                }px`,
              }}
              initial={{ rotate: direction === "next" ? -90 : 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2 whitespace-nowrap"
            >
              <span className="text-lg font-bold">{currentRelease.artist}</span>
              <span>{currentRelease.title}</span>
              <span className="text-sm text-gray-400">{currentRelease.year}</span>
              <span className="text-sm text-gray-400">{currentRelease.role}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Spotify Embed */}
        <div className="relative w-75 h-20 mt-4 flex justify-center">
          {oldRelease?.spotifyUrl && (
            <motion.iframe
              key={oldRelease.spotifyUrl}
              src={`https://open.spotify.com/embed/track/${extractTrackId(
                oldRelease.spotifyUrl
              )}`}
              width="300"
              height="80"
              className="absolute rounded"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {currentRelease.spotifyUrl && (
            <motion.iframe
              key={currentRelease.spotifyUrl}
              src={`https://open.spotify.com/embed/track/${extractTrackId(
                currentRelease.spotifyUrl
              )}`}
              width="300"
              height="80"
              className="absolute rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4 justify-center">
          <button
            className="
              px-4 py-2
              bg-gray-500 text-white text-xl font-jacquard rounded
              transition
              hover:bg-gray-400 hover:-translate-y-px
              active:bg-gray-600 active:translate-y-px
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            onClick={() => handlePrev(true)}
          >
            previous
          </button>
          <button
            className="
              px-4 py-2
              bg-gray-500 text-white text-xl font-jacquard rounded
              transition
              hover:bg-gray-400 hover:-translate-y-px
              active:bg-gray-600 active:translate-y-px
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            onClick={() => handleNext(true)}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseCard;