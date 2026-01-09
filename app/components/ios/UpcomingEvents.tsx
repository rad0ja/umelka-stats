'use client'

import { MapPin } from 'lucide-react';
import { Event } from './types';

interface UpcomingEventsProps {
    events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
                <button className="text-emerald-600 text-sm font-semibold">
                    View All
                </button>
            </div>

            <div className="space-y-3">
                {events.map((event: Event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                {event.opponent && (
                                    <p className="text-sm text-gray-500">vs {event.opponent}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-900">{formatDate(event.date)}</p>
                                <p className="text-xs text-gray-500">{event.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>Players</span>
                                    <span className="font-semibold text-gray-900">{event.players}/{event.needed}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${event.players >= event.needed ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                        style={{width: `${Math.min((event.players / event.needed) * 100, 100)}%`}}
                                    ></div>
                                </div>
                            </div>
                            <button className="ml-3 px-4 py-1.5 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                                Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
