'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, AlertCircle } from 'lucide-react';

// Types
interface User {
    id: string;
    name: string;
    email: string;
}

interface SoccerEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    maxPlayers: number;
    description?: string;
}

type AttendanceStatus = 'going' | 'tentative' | 'not_going' | 'queue';

interface Reservation {
    id: string;
    eventId: string;
    userId: string;
    status: AttendanceStatus;
    createdAt: string;
    queuePosition?: number;
}

// Mock current user (replace with your Supabase auth)
const CURRENT_USER: User = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com'
};

// Mock data
const MOCK_EVENTS: SoccerEvent[] = [
    {
        id: 'event-1',
        title: 'Weekend Friendly Match',
        date: '2024-12-20',
        time: '10:00 AM',
        location: 'Central Park Field 3',
        maxPlayers: 3,
        description: 'Casual 5v5 game, all skill levels welcome!'
    },
    {
        id: 'event-2',
        title: 'Thursday Evening Pickup',
        date: '2024-12-19',
        time: '6:00 PM',
        location: 'Riverside Stadium',
        maxPlayers: 12,
        description: 'Competitive game for experienced players'
    }
];

const MOCK_RESERVATIONS: Reservation[] = [
    { id: 'res-1', eventId: 'event-1', userId: 'user-2', status: 'going', createdAt: '2024-12-10T10:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },
    { id: 'res-2', eventId: 'event-1', userId: 'user-3', status: 'going', createdAt: '2024-12-10T11:00:00Z' },

    { id: 'res-4', eventId: 'event-1', userId: 'user-5', status: 'tentative', createdAt: '2024-12-11T09:00:00Z' },
];

const MOCK_USERS: Record<string, User> = {
    'user-1': CURRENT_USER,
    'user-2': { id: 'user-2', name: 'Alice Smith', email: 'alice@example.com' },
    'user-3': { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com' },
    'user-4': { id: 'user-4', name: 'Carol White', email: 'carol@example.com' },
    'user-5': { id: 'user-5', name: 'David Brown', email: 'david@example.com' },
};

// Event Card Component
const EventCard: React.FC<{
    event: SoccerEvent;
    reservations: Reservation[];
    currentUserId: string;
    onStatusChange: (eventId: string, status: AttendanceStatus) => void;
}> = ({ event, reservations, currentUserId, onStatusChange }) => {
    const eventReservations = reservations.filter(r => r.eventId === event.id);
    const goingCount = eventReservations.filter(r => r.status === 'going').length;
    const queueCount = eventReservations.filter(r => r.status === 'queue').length;
    const tentativeCount = eventReservations.filter(r => r.status === 'tentative').length;

    const userReservation = eventReservations.find(r => r.userId === currentUserId);
    const isFull = goingCount >= event.maxPlayers;
    const spotsLeft = event.maxPlayers - goingCount;

    const handleStatusClick = (status: AttendanceStatus) => {
        if (status === 'going' && isFull && userReservation?.status !== 'going') {
            onStatusChange(event.id, 'queue');
        } else if (status === 'going' && !isFull) {
            onStatusChange(event.id, 'going');
        } else {
            onStatusChange(event.id, status);
        }
    };

    const getButtonClass = (status: AttendanceStatus) => {
        const isActive = userReservation?.status === status ||
            (status === 'going' && userReservation?.status === 'queue');

        const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200";

        if (isActive) {
            switch (status) {
                case 'going':
                    return `${baseClass} bg-green-500 text-white shadow-lg`;
                case 'tentative':
                    return `${baseClass} bg-yellow-500 text-white shadow-lg`;
                case 'not_going':
                    return `${baseClass} bg-red-500 text-white shadow-lg`;
                default:
                    return baseClass;
            }
        }

        return `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                    spotsLeft > 3 ? 'bg-green-100 text-green-700' :
                        spotsLeft > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                }`}>
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                </div>
                <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-600" />
              <strong>{goingCount}/{event.maxPlayers}</strong> Going
            </span>
                        {tentativeCount > 0 && (
                            <span className="text-yellow-600">
                <strong>{tentativeCount}</strong> Tentative
              </span>
                        )}
                        {queueCount > 0 && (
                            <span className="text-orange-600">
                <strong>{queueCount}</strong> in Queue
              </span>
                        )}
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(goingCount / event.maxPlayers) * 100}%` }}
                    />
                </div>
            </div>

            {userReservation?.status === 'queue' && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                        You're in the queue (position {userReservation.queuePosition || queueCount}).
                        You'll be automatically moved to "Going" when a spot opens up.
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => handleStatusClick('going')}
                    className={getButtonClass('going')}
                >
                    {userReservation?.status === 'queue' ? 'Queued' : 'Going'}
                </button>
                <button
                    onClick={() => handleStatusClick('tentative')}
                    className={getButtonClass('tentative')}
                >
                    Tentative
                </button>
                <button
                    onClick={() => handleStatusClick('not_going')}
                    className={getButtonClass('not_going')}
                >
                    Can't Go
                </button>
            </div>

            {goingCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Players Going</h4>
                    <div className="flex flex-wrap gap-2">
                        {eventReservations
                            .filter(r => r.status === 'going')
                            .map(reservation => {
                                const user = MOCK_USERS[reservation.userId];
                                return (
                                    <div key={reservation.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {user?.name || 'Unknown'}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {tentativeCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Players Tentative</h4>
                    <div className="flex flex-wrap gap-2">
                        {eventReservations
                            .filter(r => r.status === 'tentative')
                            .map(reservation => {
                                const user = MOCK_USERS[reservation.userId];
                                return (
                                    <div key={reservation.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {user?.name || 'Unknown'}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main App Component
const SoccerReservationSystem: React.FC = () => {
    const [events] = useState<SoccerEvent[]>(MOCK_EVENTS);
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const currentUserId = CURRENT_USER.id;

    const handleStatusChange = (eventId: string, newStatus: AttendanceStatus) => {
        setReservations(prev => {
            const existingReservation = prev.find(
                r => r.eventId === eventId && r.userId === currentUserId
            );

            // Remove existing reservation if status is 'not_going'
            if (newStatus === 'not_going') {
                const filtered = prev.filter(
                    r => !(r.eventId === eventId && r.userId === currentUserId)
                );

                // Auto-promote from queue if applicable
                return autoPromoteFromQueue(filtered, eventId);
            }

            // Update existing reservation
            if (existingReservation) {
                const updated = prev.map(r =>
                    r.id === existingReservation.id
                        ? { ...r, status: newStatus }
                        : r
                );

                // Auto-promote from queue if spot freed up
                if (existingReservation.status === 'going' && newStatus !== 'going') {
                    return autoPromoteFromQueue(updated, eventId);
                }

                return updated;
            }

            // Create new reservation
            const newReservation: Reservation = {
                id: `res-${Date.now()}`,
                eventId,
                userId: currentUserId,
                status: newStatus,
                createdAt: new Date().toISOString()
            };

            return [...prev, newReservation];
        });
    };

    const autoPromoteFromQueue = (reservations: Reservation[], eventId: string): Reservation[] => {
        const event = events.find(e => e.id === eventId);
        if (!event) return reservations;

        const eventReservations = reservations.filter(r => r.eventId === eventId);
        const goingCount = eventReservations.filter(r => r.status === 'going').length;

        if (goingCount < event.maxPlayers) {
            const queuedReservations = eventReservations
                .filter(r => r.status === 'queue')
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            if (queuedReservations.length > 0) {
                const toPromote = queuedReservations[0];
                return reservations.map(r =>
                    r.id === toPromote.id ? { ...r, status: 'going' } : r
                );
            }
        }

        return reservations;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        ⚽ Community Soccer Matches
                    </h1>
                    <p className="text-gray-600">Reserve your spot for upcoming games</p>
                </div>

                {events.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        reservations={reservations}
                        currentUserId={currentUserId}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default SoccerReservationSystem;