"use client";

import { useCallback, useLayoutEffect, useState } from "react";

// 11am PST on January 3rd, 2026
const targetDate = new Date("2026-01-03T11:00:00-08:00");

export function Countdown() {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeRemaining(null);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  }, []);

  useLayoutEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="flex flex-col self-center gap-2 p-6">
      <div>
        <span className="text-3xl font-bold font-mono pr-1.5">
          {timeRemaining.days}
        </span>
        <span className="text-3xl pr-3">
          {timeRemaining.days > 1 ? "Days" : "Day"}
        </span>
        <span className="text-3xl font-bold font-mono">
          {timeRemaining.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-3xl pr-3">h</span>
        <span className="text-3xl font-bold font-mono">
          {timeRemaining.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-3xl pr-3">m</span>
        <span className="text-3xl font-bold font-mono">
          {timeRemaining.seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-3xl">s</span>
      </div>
      <span className="self-center text-3xl">Until Launch</span>
    </div>
  );
}
