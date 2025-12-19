import React from 'react';
import { HomeEvent } from "@/app/types";
import { Calendar, ChevronRight, Clock, MapPin } from 'lucide-react';

interface UpcomingEventsProps {
    events: HomeEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                    View Calendar <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: HomeEvent) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 hover:-translate-y-1"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                {event.opponent && (
                                    <p className="text-gray-600">vs {event.opponent}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{event.location}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Players confirmed</span>
                                <span className="text-sm font-semibold text-gray-900">{event.players}/{event.needed}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${event.players >= event.needed ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                    style={{width: `${(event.players / event.needed) * 100}%`}}
                                ></div>
                            </div>
                            <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                                {event.players >= event.needed ? 'View Details' : 'Join Match'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UpcomingEvents;
