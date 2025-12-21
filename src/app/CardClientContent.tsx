"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Star, Loader2, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

const VERSES = [{ ref: "Luke 2:11", text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord." }];
const SHEETDB_URL = "https://sheetdb.io/api/v1/tgo9mz1m8qunj";

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

// Renamed to CardClientContent to match the import in page.tsx
export default function CardClientContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); 
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  useEffect(() => {
    async function loadPersonalizedData() {
      // SAFETY NET: Check URL first, then check phone memory
      const savedId = userId || sessionStorage.getItem("christmas_card_id");
      
      if (userId) {
        sessionStorage.setItem("christmas_card_id", userId);
      }

      const defaultName = "Kaye";
      const defaultMsg = "Wishing you a joyful Christmas and a wonderful start to the year 2026.\n\nMay this season bring happiness, warmth, and many new memories.";

      if (!savedId) {
        setRecipientName(defaultName);
        setCustomMessage(defaultMsg);
        setIsLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`${SHEETDB_URL}/search?id=${savedId}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setRecipientName(data[0].name);
          setCustomMessage(data[0].message);
        } else {
          setRecipientName(defaultName);
          setCustomMessage(defaultMsg);
        }
      } catch (error) {
        console.error("SheetDB Error:", error);
        setRecipientName(defaultName);
        setCustomMessage(defaultMsg);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadPersonalizedData();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 3500);
    if (videoRef.current && videoRef.current.readyState >= 2) setIsVideoLoaded(true);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMuted(false);
    const colors = ["#ffffff", "#D4AF37", "#f8f8ff"];

    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      shapes: ['circle'],
      scalar: 0.8,
    });

    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      shapes: ['circle'],
      scalar: 0.8,
    });

    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleReplay = () => {
    setIsOpen(false);
    setIsMuted(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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
        autoPlay muted loop playsInline
        onLoadedData={() => setIsVideoLoaded(true)} 
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
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                <Star className="w-12 h-12 text-holy-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" fill="currentColor" />
              </motion.div>
              <h1 className="font-serif text-5xl text-holy-white leading-tight">A Special<br />Christmas Card</h1>

              <div className="min-h-[2rem] flex items-center justify-center">
                {isLoadingData ? (
                  <div className="w-24 h-6 bg-holy-gold/10 animate-pulse rounded-md" />
                ) : (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="font-serif text-xl text-holy-gold/80"
                  >
                    for {recipientName}
                  </motion.p>
                )}
              </div>

              <p className="font-serif italic text-sm text-holy-gold/70 tracking-wide">— from Denin</p>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <button
                onClick={handleOpen}
                disabled={!isVideoLoaded || isLoadingData}
                className="group relative px-10 h-14 rounded-full font-serif text-lg tracking-[0.15em] text-holy-cream bg-holy-red border border-holy-gold/30 active:scale-95 transition-all duration-300 overflow-hidden animate-holyPulse disabled:opacity-70 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {(!isVideoLoaded || isLoadingData) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-holy-gold" />
                      <span className="text-sm tracking-widest uppercase">Preparing</span>
                    </>
                  ) : (
                    <span className="pb-[2px]">OPEN</span>
                  )}
                </span>
              </button>
              <div className="text-[9px] tracking-widest text-holy-cream/40">Denin George · © 2025</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="z-30 flex flex-col items-center h-[85vh] w-[90vw] max-w-md p-8 text-center relative glass rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute top-6 right-6 z-40 flex gap-3">
              <button onClick={handleReplay} className="text-holy-gold/60 hover:text-holy-gold"><RotateCcw size={24} /></button>
              <button onClick={toggleAudio} className="text-holy-gold/60 hover:text-holy-gold">{isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
            </div>

            <div className="flex flex-col h-full justify-center items-center space-y-8">
              <div className="flex flex-col items-center">
                <h2 className="font-serif text-2xl text-holy-cream tracking-wide">Merry Christmas,</h2>
                <h2 className="font-serif text-4xl text-holy-gold mt-2 font-bold tracking-wide">{recipientName}</h2>
              </div>
              <div className="w-20 h-[1px] bg-holy-gold/40 my-2" />
              <div className="max-w-[340px] text-left">
                <p className="text-sm italic text-holy-cream/90 leading-relaxed whitespace-pre-line">
                  {recipientName},<br />
                  {customMessage}
                </p>
                <p className="text-xs italic text-holy-gold mt-2 text-right">— Denin</p>
              </div>
              <div className="w-16 h-[1px] bg-holy-gold/30 my-3" />
              <div className="space-y-2 max-w-[320px]">
                <p className="font-serif text-lg italic leading-relaxed text-holy-cream/90 px-2">&quot;{VERSES[0].text}&quot;</p>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-holy-gold text-right">— {VERSES[0].ref}</p>
              </div>
            </div>

            <div className="mt-auto pb-4 flex flex-col items-center gap-1">
              <div className="font-serif text-holy-gold/80 italic text-lg tracking-wide">— from Denin George ❤️</div>
              <div className="text-[9px] tracking-widest text-holy-cream/40">Hand-crafted & lovingly coded by Denin George · © 2025</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}