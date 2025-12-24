"use client";

import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="p-6 max-w-md w-full">
      <table className="mx-auto mb-4">
        <tbody>
          <tr>
            <td className="text-3xl font-bold text-gray-800 text-right pr-2">
              {timeRemaining.days}
            </td>
            <td className="text-3xl text-gray-600 pl-2">Days</td>
          </tr>
          <tr>
            <td className="text-3xl font-bold text-gray-800 text-right pr-2">
              {timeRemaining.hours}
            </td>
            <td className="text-3xl text-gray-600 pl-2">Hours</td>
          </tr>
          <tr>
            <td className="text-3xl font-bold text-gray-800 text-right pr-2">
              {timeRemaining.minutes}
            </td>
            <td className="text-3xl text-gray-600 pl-2">Minutes</td>
          </tr>
          <tr>
            <td className="text-3xl font-bold text-gray-800 text-right pr-2">
              {timeRemaining.seconds}
            </td>
            <td className="text-3xl text-gray-600 pl-2">Seconds</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
