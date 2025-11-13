"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Ticket from "@/components/Ticket";


// Dummy ticket data
const dummyTickets = [
  {
    _id: "ticket_123",
    eventName: "AI Conference 2025",
    holderName: "John Doe",
    seat: "A12",
    date: new Date().toISOString(),
  },
];

export default function TicketSuccess() {
  const [latestTicket, setLatestTicket] = useState(dummyTickets[dummyTickets.length - 1]);

  // Optional: simulate loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading ticket...</p>
      </div>
    );
  }

  if (!latestTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No ticket found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ticket Purchase Successful!
          </h1>
          <p className="mt-2 text-gray-600">
            Your ticket has been confirmed and is ready to use
          </p>
        </div>

        {/* Render the ticket component */}
        <Ticket ticketId={latestTicket._id} />

        {/* Optional: Button to go back to events */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => window.location.href = "/events"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Events
          </Button>
        </div>
      </div>
    </div>
  );
}
