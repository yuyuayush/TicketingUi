"use client";

import React, { useEffect, useState } from "react";

interface SeatTimerProps {
  seconds: number;
  onExpire?: () => void;
}

export const SeatTimer: React.FC<SeatTimerProps> = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds); // Reset if seconds prop changes
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  return (
    <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-semibold mb-2">Booking Session Timer</h3>
      <div className="text-5xl font-mono">
        {minutes}:{sec.toString().padStart(2, "0")}
      </div>
      <p className="mt-2 text-sm">{timeLeft > 0 ? "Time is ticking..." : "Time Expired!"}</p>
    </div>
  );
};
