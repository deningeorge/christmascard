"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

// --- Data: Bible Verses ---
const VERSES = [
  {
    ref: "Luke 2:11",
    text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord."
  },
  {
    ref: "Isaiah 9:6",
    text: "For to us a child is born, to us a son is given... and his name shall be called Wonderful Counselor, Mighty God."
  },
  {
    ref: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
  },
  {
    ref: "Matthew 1:23",
    text: "The virgin will conceive and give birth to a son, and they will call him Immanuel (which means 'God with us')."
  }
];

// --- Component: Snow Particle ---
const Snow = () => {
  // useMemo generates the values once and remembers them.
  // It is "pure" because it doesn't trigger a re-render; it just returns data.
  const snowflakes = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.5) + (Math.sin(i) * 2)}%`, // Deterministic-ish spread
      duration: 10 + (i % 10), // Varies from 10-20s based on index
      delay: (i % 5) * 2, // Varies delay based on index
      size: 2 + (i % 4), // Varies size 2-6px
    }));
  }, []); // Empty dependency array means it only runs once

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-60"
          initial={{ y: -10, opacity: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
          style={{
            width: flake.size,
            height: flake.size,
            left: flake.left,
          }}
        />
      ))}
    </div>
  );
};

// --- Main Content Component ---
function CardContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const searchParams = useSearchParams();
  const recipientName = searchParams.get("to") || "Friend";
  const verseIndex = parseInt(searchParams.get("v") || "0");
  const selectedVerse = VERSES[verseIndex] || VERSES[0];

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
    <div className="relative h-[100dvh] w-full flex items-center justify-center bg-linear-to-b from-holy-blue to-[#1e293b]">
      <audio ref={audioRef} loop src="/music/music.mp3" />
      <Snow />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            className="z-10 flex flex-col items-center justify-between h-full w-full max-w-md p-8 py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.2 }}
          >
            <div className="flex flex-col items-center gap-6 mt-10">
              <Star className="w-12 h-12 text-holy-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" fill="currentColor" />
              <h1 className="font-serif text-5xl text-holy-gold leading-tight">
                Merry<br />Christmas
              </h1>
              <p className="font-sans font-light text-lg tracking-wide opacity-80 text-holy-cream">
                Celebrating the Birth of Christ
              </p>
            </div>

            <button
              onClick={handleOpen}
              className="mb-10 px-14 py-4 bg-holy-red rounded-full font-serif text-xl tracking-[0.2em] shadow-2xl active:scale-95 transition-transform border border-holy-gold/20"
            >
              OPEN
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="z-10 flex flex-col items-center h-full w-full max-w-md p-10 text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            {/* Audio Toggle */}
            <button onClick={toggleAudio} className="absolute top-8 right-8 z-30 text-holy-gold/60">
              {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
            </button>

            <div className="flex flex-col h-full justify-center items-center space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <h2 className="font-serif text-3xl">Merry Christmas,</h2>
                <h2 className="font-serif text-4xl text-holy-gold mt-2">{recipientName}</h2>
              </motion.div>

              <motion.div 
                className="w-16 h-[1px] bg-holy-gold/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1.5 }}
                className="space-y-6"
              >
                <p className="font-serif text-2xl italic leading-relaxed text-holy-cream/90">
                  &quot;{selectedVerse.text}&quot;
                </p>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-holy-gold">
                  — {selectedVerse.ref}
                </p>
              </motion.div>

              <motion.p
                className="font-sans font-light text-sm text-holy-cream/60 max-w-[280px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                May His love guide you and His peace be with you always.
              </motion.p>
            </div>

            <motion.div
              className="mt-auto pb-6 font-serif text-holy-gold/80 italic text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 1 }}
            >
              — from Denin ❤️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Loading Wrapper (Required for useSearchParams) ---
export default function ChristmasCard() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-holy-blue" />}>
      <CardContent />
    </Suspense>
  );
}