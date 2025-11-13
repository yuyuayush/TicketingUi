"use client";

import { useState, useEffect } from "react";
import { CalendarDays, IdCard, MapPin, Ticket as TicketIcon, User } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";

// Dummy ticket data
const dummyTicket = {
  _id: "ticket_123",
  purchasedAt: new Date().toISOString(),
  event: {
    _id: "event_123",
    name: "AI Conference 2025",
    eventDate: new Date().toISOString(),
    location: "Berlin, Germany",
    price: 49.99,
    image: "/poster2.jpg", // local or external image
    is_cancelled: false,
  },
  user: {
    name: "John Doe",
    email: "john@example.com",
    userId: "user_123",
  },
};

export default function Ticket({ ticketId }: { ticketId?: string }) {
  const [ticket, setTicket] = useState(dummyTicket);

  // Optional: simulate fetching/loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  const { event, user } = ticket;
  const imageUrl = event.image;

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-xl border ${event.is_cancelled ? "border-red-200" : "border-gray-100"}`}>
      {/* Event Header */}
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full aspect-[21/9]">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className={`object-cover object-center ${event.is_cancelled ? "opacity-50" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
          </div>
        )}
        <div className={`px-6 py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : event.is_cancelled ? "bg-red-600" : "bg-pink-600"}`}>
          <h2 className={`text-2xl font-bold text-white`}>{event.name}</h2>
          {event.is_cancelled && <p className="text-red-300 mt-1">This event has been cancelled</p>}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <CalendarDays className={`w-5 h-5 mr-3 ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`} />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className={`w-5 h-5 mr-3 ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <User className={`w-5 h-5 mr-3 ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`} />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 break-all">
              <IdCard className={`w-5 h-5 mr-3 ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`} />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder ID</p>
                <p className="font-medium">{user.userId}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <TicketIcon className={`w-5 h-5 mr-3 ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`} />
              <div>
                <p className="text-sm text-gray-500">Ticket Price</p>
                <p className="font-medium">{event.price.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Right Column - QR */}
          <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-6">
            <div className={`bg-gray-100 p-4 rounded-lg ${event.is_cancelled ? "opacity-50" : ""}`}>
              <QRCode value={ticket._id} className="w-32 h-32" />
            </div>
            <p className="mt-2 text-xs text-gray-500 uppercase break-all text-center max-w-[200px] md:max-w-full">
              Ticket ID: {ticket._id}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Important Information</h3>
          {event.is_cancelled ? (
            <p className="text-sm text-red-600">This event has been cancelled. A refund will be processed if it hasn&apos;t been already.</p>
          ) : (
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Please arrive at least 30 minutes before the event</li>
              <li>• Have your ticket QR code ready for scanning</li>
              <li>• This ticket is non-transferable</li>
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div className={`${event.is_cancelled ? "bg-red-50" : "bg-gray-50"} px-6 py-4 flex justify-between items-center`}>
        <span className="text-sm text-gray-500">Purchase Date: {new Date(ticket.purchasedAt).toLocaleString()}</span>
        <span className={`text-sm font-medium ${event.is_cancelled ? "text-red-600" : "text-pink-600"}`}>
          {event.is_cancelled ? "Cancelled" : "Valid Ticket"}
        </span>
      </div>
    </div>
  );
}
