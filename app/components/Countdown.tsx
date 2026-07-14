"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  variant?: "cards" | "compact";
  accentColorClass?: string; // e.g. text-red-500
}

export default function Countdown({
  variant = "cards",
  accentColorClass = "text-red-500",
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setMounted(true);
    
    // Target date: July 21, 2026, 8:00 PM West Africa Time (UTC+1)
    const targetDate = new Date("2026-07-21T20:00:00+01:00").getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    if (variant === "compact") {
      return (
        <div className="flex flex-col items-center sm:items-start">
          <div className="font-mono text-base font-bold tracking-wider text-red-500">
            -- DAYS · -- HRS · -- MIN
          </div>
          <div className="text-[10px] font-mono tracking-widest text-teal-900/60 uppercase mt-0.5">
            until we go live
          </div>
        </div>
      );
    }
    
    // Return cards skeleton
    return (
      <div className="flex items-center gap-3 sm:gap-4 select-none">
        {["DAYS", "HRS", "MIN", "SEC"].map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-900/5 border border-teal-900/10 flex items-center justify-center font-mono text-xl sm:text-2xl font-bold text-teal-900/30">
              --
            </div>
            <span className="text-[9px] font-mono tracking-widest text-teal-900/50 mt-1.5 uppercase">
              {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center sm:items-start">
        <div className={`font-mono text-base font-bold tracking-wider ${accentColorClass}`}>
          {timeLeft.days} DAYS · {timeLeft.hours} HRS · {timeLeft.minutes} MIN
        </div>
        <div className="text-[10px] font-mono tracking-widest text-teal-900/60 dark:text-cream-50/60 uppercase mt-0.5">
          until we go live
        </div>
      </div>
    );
  }

  // Cards layout for Hero
  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      {/* Days Card */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-900/5 border border-teal-900/10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold text-teal-900 shadow-sm transition-all duration-300">
          {timeLeft.days}
        </div>
        <span className="text-[9px] font-mono tracking-widest text-teal-900/60 mt-1.5 uppercase font-medium">
          Days
        </span>
      </div>

      {/* Colon */}
      <span className="font-mono text-xl text-teal-900/40 -mt-5 font-bold">:</span>

      {/* Hours Card */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-900/5 border border-teal-900/10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold text-teal-900 shadow-sm transition-all duration-300">
          {timeLeft.hours}
        </div>
        <span className="text-[9px] font-mono tracking-widest text-teal-900/60 mt-1.5 uppercase font-medium">
          Hours
        </span>
      </div>

      {/* Colon */}
      <span className="font-mono text-xl text-teal-900/40 -mt-5 font-bold">:</span>

      {/* Minutes Card */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-900/5 border border-teal-900/10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold text-teal-900 shadow-sm transition-all duration-300">
          {timeLeft.minutes}
        </div>
        <span className="text-[9px] font-mono tracking-widest text-teal-900/60 mt-1.5 uppercase font-medium">
          Mins
        </span>
      </div>

      {/* Colon */}
      <span className="font-mono text-xl text-teal-900/40 -mt-5 font-bold">:</span>

      {/* Seconds Card */}
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold ${accentColorClass} shadow-sm transition-all duration-300`}>
          {timeLeft.seconds}
        </div>
        <span className="text-[9px] font-mono tracking-widest text-red-500/70 mt-1.5 uppercase font-medium">
          Secs
        </span>
      </div>
    </div>
  );
}
