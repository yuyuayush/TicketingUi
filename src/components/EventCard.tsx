"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Ticket,
  StarIcon,
} from "lucide-react";
import { EventType } from "@/lib/types";

interface EventCardProps {
  event: EventType;
  userId?: string; // for "Your Event" badge simulation
}

export default function EventCard({ event, userId }: EventCardProps) {
  const router = useRouter();
  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = userId === event.userId;

  return (
    <div
      onClick={() => router.push(`/event/${event._id}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Event Image */}
      {event.image && (
        <div className="relative w-full h-48">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className={`p-6 ${event.image ? "relative" : ""}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Event
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col items-end gap-2 ml-4">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full ${
                isPastEvent ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"
              }`}
            >
              {event.price.toFixed(2)}€
            </span>
            {event.purchasedCount >= event.totalTickets && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}{" "}
              {isPastEvent && "(Ended)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>
              {event.totalTickets - event.purchasedCount} / {event.totalTickets} available
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{event.description}</p>
      </div>
    </div>
  );
}
