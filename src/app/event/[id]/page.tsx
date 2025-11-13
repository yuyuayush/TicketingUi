"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import EventCard from "@/components/EventCard";

import JoinQueue from "@/components/JoinQueue";
import { dummyEvents } from "@/lib/constants";
import { EventType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ArenaSeating from "@/components/AreanSeets";


export default function EventPage() {
  // Dummy user simulation
  const user = null; // Set to null to simulate not signed in
  const params = useParams();
  const eventId = params.id;

  // Find event from constant array
  const event: EventType | undefined = dummyEvents.find((e) => e._id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const isPastEvent = event.eventDate < Date.now();
  const availableTickets = event.totalTickets - event.purchasedCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Event Image */}
          {event.image && (
            <div className="aspect-[21/9] relative w-full">
              <Image src={event.image} alt={event.name} fill className="object-cover" />
            </div>
          )}

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-5 h-5 mr-2 text-pink-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Ticket className="w-5 h-5 mr-2 text-pink-600" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-gray-900">{event.price.toFixed(2)} €</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-pink-600" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900">
                      {availableTickets} / {event.totalTickets} left
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Tickets are non-refundable, unless the event is canceled</li>
                    <li>• Please arrive 30 minutes before the event starts</li>
                    <li>• Ensure you bring a valid ID for entry</li>
                    <li>• Age restriction: 18+</li>
                  </ul>
                </div>
              </div>
              <ArenaSeating/>

              {/* Right Side */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard event={event} userId={user?.id} />

                  {/* Dummy Signup / Join Queue */}
                  {!user ? (
                    <Link href="/register">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Sign up to buy tickets
                      </Button>
                    </Link>
                  ) : (
                    <JoinQueue eventId={event._id} userId={user.id} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
