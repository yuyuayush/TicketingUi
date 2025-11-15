"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSeatsByConcert, useLockSeats, useUnlockSeats } from "@/hooks/useSeat";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { useSeatStore } from "@/store/useSeatStore";
import { getSeatColor, items } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuth";
import { SeatButtonProps, SeatMapProps } from "@/lib/types";
import BookingPanel from "@/components/seat/BookingPanel";






const SeatSelectionPage = () => {
  const params = useParams();
  const concertId = params.id;

  const { data: seats = [], isLoading } = useGetSeatsByConcert(concertId as string);
  const lockSeatsMutation = useLockSeats();
  const unlockSeatsMutation = useUnlockSeats();

  const { currentUser } = useAuthStore();
  const userId = currentUser?.id;

  const {
    selectedSeats,
    totalAmount,
    locked,
    timer,
    setLocked,
    setTimer,
    toggleSeat,
    resetSeats,
  } = useSeatStore();

  const handleLockSeats = () => {
    lockSeatsMutation.mutate(
      { concertId, seatIds: selectedSeats.map((s) => s._id) },
      {
        onSuccess: (res) => {
          setLocked(true);
          setTimer(600);
          if (res.failedSeats?.length) {
            alert(`These seats are already locked/reserved: ${res.failedSeats.join(", ")}`);
          }
        },
      }
    );
  };

  const handleUnlockSeats = () => {
    unlockSeatsMutation.mutate(
      { concertId, seatIds: selectedSeats.map((s) => s._id) },
      { onSuccess: () => resetSeats() }
    );
  };


  useEffect(() => {
    if (!seats.length) return;

    const lockedSeat = seats.find(
      (s) => s.lockedBy === userId && s?.lockedAt && s.status === "RESERVED"
    );

    if (lockedSeat?.lockedAt) {
      const lockedTime = new Date(lockedSeat?.lockedAt).getTime();
      const now = Date.now();
      const lockDuration = 10 * 60 * 1000; // 10 minutes
      const remainingTime = Math.max(0, Math.floor((lockDuration - (now - lockedTime)) / 1000));

      if (remainingTime > 0) {
        setLocked(true);
        setTimer(remainingTime);
      }
    }
  }, [seats, userId, setLocked, setTimer]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen p-6 gap-6 bg-gray-50">
      <SeatMap seats={seats} toggleSeat={toggleSeat} selectedSeats={selectedSeats} locked={locked} />
      <BookingPanel
        selectedSeats={selectedSeats}
        totalAmount={totalAmount}
        locked={locked}
        timer={timer}
        handleLockSeats={handleLockSeats}
        handleUnlockSeats={handleUnlockSeats}
      />
    </div>
  );
};

export default SeatSelectionPage;


const SeatButton: React.FC<SeatButtonProps> = ({ seat, toggleSeat, selectedSeats, locked }) => {
  const isDisabled =
    seat.status === "RESERVED" || seat.status === "BOOKED" || locked;

  return (
    <button
      key={seat._id}
      onClick={() => !isDisabled && toggleSeat(seat)}
      className={`rounded-lg text-white flex items-center justify-center font-bold 
        ${getSeatColor(seat, selectedSeats)} 
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}
    >
      {seat.seatNumber}
    </button>
  );
};



const SeatMap: React.FC<SeatMapProps> = ({ seats, toggleSeat, selectedSeats, locked }) => {
  const maxRow = Math.max(...seats.map((s) => parseInt(s.row)));
  const maxColumn = Math.max(...seats.map((s) => s.column));

  return (
    <Card className="flex-1 p-4">
      <CardHeader>
        <CardTitle>Choose Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-2 justify-center"
          style={{
            gridTemplateRows: `repeat(${maxRow}, 50px)`,
            gridTemplateColumns: `repeat(${maxColumn}, 50px)`,
          }}
        >
          {seats.map((seat) => (
            <SeatButton
              key={seat._id}
              seat={seat}
              toggleSeat={toggleSeat}
              selectedSeats={selectedSeats}
              locked={locked}
            />
          ))}
        </div>
        <Legend />
      </CardContent>
    </Card>
  );
};

const Legend: React.FC = () => {

  return (
    <div className="flex flex-col gap-1 mt-4 text-sm">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className={`w-4 h-4 inline-block ${item.color}`}></span>
          {item.label}
        </span>
      ))}
    </div>
  );
};