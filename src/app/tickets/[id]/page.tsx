"use client";

import Ticket from "@/components/Ticket";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetBookingById } from "@/hooks/useBooking";

export default function TicketPage() {
  const { id } = useParams();
  const bookingId = id as string;

  const { data: booking, isLoading, error } = useGetBookingById(bookingId);
  console.log(booking);

  if (isLoading) return <p className="text-center py-10">Loading ticket...</p>;
  if (error || !booking)
    return (
      <p className="text-center py-10 text-red-600">Ticket not found!</p>
    );

  const concert = booking.concertId;
  const user = booking.user;

  const isPastEvent = new Date(concert.endTime) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/tickets" className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-4 h-4" /> Back to Tickets
          </Link>

          <div className="flex gap-3">
            <button className="flex gap-2 items-center hover:bg-gray-200 px-3 py-2 rounded-lg">
              <Download className="w-4 h-4" /> Save
            </button>
            <button className="flex gap-2 items-center hover:bg-gray-200 px-3 py-2 rounded-lg">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {concert.title}
          </h1>

          <p className="text-gray-600">
            {new Date(concert.startTime).toLocaleDateString()} •
            {new Date(concert.startTime).toLocaleTimeString()}
          </p>

          <p className="text-sm text-gray-500">
            Booked by: {user.name} ({user.email})
          </p>

          <p className="text-sm text-gray-500">
            Booking ID: {booking.bookingId}
          </p>

          <p className="text-sm text-gray-500">
            Purchased on {new Date(booking.createdAt).toLocaleDateString()}
          </p>

          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
            isPastEvent ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
          }`}>
            {isPastEvent ? "Event Ended" : "Valid Ticket"}
          </span>
        </div>

        {/* Ticket Design */}
        <Ticket ticket={booking} />

        {/* Footer Help */}
        <div className="bg-blue-50 border-blue-200 border p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            Need help? Contact support@tixly.com
          </p>
        </div>

      </div>
    </div>
  );
}
