"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Star, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

// --- Data: Bible Verses ---
const VERSES = [
  { ref: "Luke 2:11", text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord." },
  { ref: "Isaiah 9:6", text: "For to us a child is born, to us a son is given... and his name shall be called Wonderful Counselor, Mighty God." },
  { ref: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
  { ref: "Matthew 1:23", text: "The virgin will conceive and give birth to a son, and they will call him Immanuel (which means 'God with us')." }
];

// --- Component: Snow Particle ---
const Snow = () => {
  const snowflakes = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.5) + (Math.sin(i) * 2)}%`,
      duration: 10 + (i % 10),
      delay: (i % 5) * 2,
      size: 2 + (i % 4),
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-40"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 0.6, 0] }}
          transition={{ duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: "linear" }}
          style={{ width: flake.size, height: flake.size, left: flake.left }}
        />
      ))}
    </div>
  );
};

// --- Main Content Component ---
function CardContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); 
  
  const searchParams = useSearchParams();
  const recipientName = searchParams.get("to") || "Friend";
  const verseIndex = parseInt(searchParams.get("v") || "0");
  const selectedVerse = VERSES[verseIndex] || VERSES[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 3500);

    if (videoRef.current && videoRef.current.readyState >= 2) {
      setIsVideoLoaded(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => console.log("Audio needs user gesture"));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.play();
      else audioRef.current.pause();
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full flex items-center justify-center bg-holy-blue overflow-hidden">
      
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)} 
        onError={() => setIsVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-2000 ${
          isVideoLoaded ? "opacity-40" : "opacity-0"
        }`}
      >
        <source src="/background.webm" type="video/webm" />
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-holy-blue/90 z-1" />
      <audio ref={audioRef} loop src="/music/music.mp3" />
      <Snow />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            className="z-30 flex flex-col items-center justify-between h-full w-full max-md p-8 py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.2 }}
          >
            <div className="flex flex-col items-center gap-6 mt-10 p-8 glass rounded-[2.5rem]">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="w-12 h-12 text-holy-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" fill="currentColor" />
              </motion.div>
              <h1 className="font-serif text-5xl text-holy-white leading-tight">
                Merry<br />Christmas
              </h1>
              <p className="font-sans font-light text-lg tracking-wide opacity-80 text-holy-cream">
                Celebrating the Birth of Christ
              </p>
            </div>

            <button
              onClick={handleOpen}
              className="mb-10 px-14 py-4 bg-holy-red text-holy-white rounded-full font-serif text-xl tracking-[0.2em] shadow-2xl active:scale-95 transition-all border border-holy-gold/20 flex items-center gap-3"
            >
              {!isVideoLoaded && <Loader2 className="w-5 h-5 animate-spin" />}
              {isVideoLoaded ? "OPEN" : "PREPARING..."}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="z-30 flex flex-col items-center h-[85vh] w-[90vw] max-w-md p-8 text-center relative glass rounded-[2.5rem] shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <button onClick={toggleAudio} className="absolute top-6 right-6 z-40 text-holy-gold/60">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="flex flex-col h-full justify-center items-center space-y-8">
              <div className="flex flex-col items-center">
                <h2 className="font-serif text-2xl text-holy-cream">Merry Christmas,</h2>
                <h2 className="font-serif text-4xl text-holy-gold mt-2">{recipientName}</h2>
              </div>

              <div className="w-16 h-[1px] bg-holy-gold/40" />

              <div className="space-y-6">
                <p className="font-serif text-xl italic leading-relaxed text-holy-cream/90 px-2">
                  &quot;{selectedVerse.text}&quot;
                </p>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-holy-gold">
                  — {selectedVerse.ref}
                </p>
              </div>

              <p className="font-sans font-light text-xs text-holy-cream/60 max-w-[250px]">
                May the gift of Jesus bring peace and hope to your home this season.
              </p>
            </div>

            <div className="mt-auto pb-4 font-serif text-holy-gold/80 italic text-lg">
              — from Denin ❤️
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- FINAL EXPORT ---
export default function ChristmasCardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-holy-blue flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-holy-gold" />
      </div>
    }>
      <CardContent />
    </Suspense>
  );
}