"use client";

import { useGetSeatsByConcert } from "@/hooks/useSeat";
import { useAuthStore } from "@/store/useAuth";
import { useSeatStore } from "@/store/useSeatStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SeatTimerProps {
  seconds: number;
  onExpire?: () => void;
}



export const SeatTimer: React.FC<SeatTimerProps> = ({ seconds, onExpire }) => {


  const params = useParams();
  const concertId = params.id;
  const { currentUser } = useAuthStore();
  const [timer, setTimer] = useState(seconds);

  const { data: seats = [], isLoading } = useGetSeatsByConcert(concertId as string);


  useEffect(() => {
    if (!seats.length) return;

    const lockedSeat = seats.find(
      (s) => s.lockedBy === currentUser?.id && s?.lockedAt && s.status === "RESERVED"
    );

    if (lockedSeat?.lockedAt) {
      const lockedTime = new Date(lockedSeat?.lockedAt).getTime();
      const now = Date.now();
      const lockDuration = 10 * 60 * 1000; // 10 minutes
      const remainingTime = Math.max(0, Math.floor((lockDuration - (now - lockedTime)) / 1000));

      if (remainingTime > 0) {
        // setLocked(true);
        setTimer(remainingTime);
      }
    }
  }, [seats, setTimer]);



  useEffect(() => {
    setTimer(timer);
  }, [timer, timer]);

  useEffect(() => {
    if (timer <= 0) {
      onExpire?.();
      return;
    }


    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);


    return () => clearInterval(intervalId);
  }, [setTimer, onExpire]);

  const minutes = Math.floor(timer / 60);
  const sec = timer % 60;

  return (
    <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-semibold mb-2">Booking Session Timer</h3>
      <div className="text-5xl font-mono">
        {minutes}:{sec.toString().padStart(2, "0")}
      </div>
      <p className="mt-2 text-sm">{timer > 0 ? "Time is ticking..." : "Time Expired!"}</p>
    </div>
  );
};
