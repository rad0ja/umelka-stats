'use client'

import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Users, Trophy, Bell, User, ChevronRight, MapPin, Clock } from 'lucide-react';

interface Match {
    id: number;
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    date: string;
    location: string;
    status: 'win' | 'loss' | 'draw';
}

interface Event {
    id: number;
    title: string;
    opponent: string | null;
    date: string;
    time: string;
    location: string;
    players: number;
    needed: number;
}

interface Stat {
    label: string;
    value: number | string;
    icon: string;
}

interface PlayerStats {
    name: string;
    avatar: string;
    stats: Stat[];
}

type MatchStatus = 'win' | 'loss' | 'draw';

export default function FotbalekHomepage() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const recentMatches: Match[] = [
        {
            id: 1,
            team1: "Green Eagles",
            team2: "Blue Sharks",
            score1: 3,
            score2: 2,
            date: "Nov 29, 2024",
            location: "Central Park Field",
            status: "win"
        },
        {
            id: 2,
            team1: "Red Dragons",
            team2: "Green Eagles",
            score1: 1,
            score2: 1,
            date: "Nov 26, 2024",
            location: "Riverside Stadium",
            status: "draw"
        },
        {
            id: 3,
            team1: "Green Eagles",
            team2: "Yellow Tigers",
            score1: 2,
            score2: 4,
            date: "Nov 23, 2024",
            location: "Downtown Arena",
            status: "loss"
        }
    ];

    const upcomingEvents: Event[] = [
        {
            id: 1,
            title: "Friendly Match",
            opponent: "White Knights",
            date: "Dec 5, 2024",
            time: "18:00",
            location: "North Field",
            players: 12,
            needed: 14
        },
        {
            id: 2,
            title: "League Game",
            opponent: "Black Panthers",
            date: "Dec 8, 2024",
            time: "15:30",
            location: "Main Stadium",
            players: 14,
            needed: 14
        },
        {
            id: 3,
            title: "Training Session",
            opponent: null,
            date: "Dec 10, 2024",
            time: "19:00",
            location: "Practice Ground",
            players: 8,
            needed: 20
        }
    ];

    const playerStats: PlayerStats = {
        name: "John Doe",
        avatar: "JD",
        stats: [
            { label: "Matches Played", value: 28, icon: "🎮" },
            { label: "Goals Scored", value: 12, icon: "⚽" },
            { label: "Assists", value: 8, icon: "🎯" },
            { label: "Clean Sheets", value: 5, icon: "🛡️" },
            { label: "Yellow Cards", value: 3, icon: "🟨" },
            { label: "Win Rate", value: "64%", icon: "🏆" }
        ]
    };

    const getStatusColor = (status: MatchStatus): string => {
        switch(status) {
            case 'win': return 'bg-green-100 text-green-700 border-green-300';
            case 'loss': return 'bg-red-100 text-red-700 border-red-300';
            case 'draw': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusText = (status: MatchStatus): string => {
        switch(status) {
            case 'win': return 'Victory';
            case 'loss': return 'Defeat';
            case 'draw': return 'Draw';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45 text-white font-bold text-xl">⚽</div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Fotbalek.App
              </span>
                        </div>

                        <div className="hidden md:flex space-x-6">
                            <a href="#" className="flex items-center gap-2 text-emerald-600 font-semibold">
                                <Home className="w-5 h-5" /> Home
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                <Calendar className="w-5 h-5" /> Matches
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                <Users className="w-5 h-5" /> Teams
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                <Trophy className="w-5 h-5" /> Stats
                            </a>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <button className="relative">
                                <Bell className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                                JD
                            </div>
                        </div>

                        <button
                            className="md:hidden text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-4 space-y-3">
                            <a href="#" className="flex items-center gap-2 text-emerald-600 font-semibold">
                                <Home className="w-5 h-5" /> Home
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-5 h-5" /> Matches
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600">
                                <Users className="w-5 h-5" /> Teams
                            </a>
                            <a href="#" className="flex items-center gap-2 text-gray-600">
                                <Trophy className="w-5 h-5" /> Stats
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, <span className="text-emerald-600">{playerStats.name}</span>!
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your soccer community</p>
                </div>

                {/* Recent Matches Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
                        <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                        {recentMatches.map((match: Match) => (
                            <div
                                key={match.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-emerald-500"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-xl font-bold text-gray-900">{match.team1}</div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-emerald-600">{match.score1}</span>
                                                <span className="text-gray-400">-</span>
                                                <span className="text-2xl font-bold text-gray-600">{match.score2}</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">{match.team2}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {match.date}
                      </span>
                                            <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {match.location}
                      </span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(match.status)}`}>
                                        {getStatusText(match.status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upcoming Events Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                        <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                            View Calendar <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event: Event) => (
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

                {/* Player Stats Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
                        <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                            Full Report <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                                {playerStats.avatar}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{playerStats.name}</h3>
                                <p className="text-gray-600">Green Eagles • Midfielder</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {playerStats.stats.map((stat: Stat, index: number) => (
                                <div
                                    key={index}
                                    className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl hover:shadow-lg transition-all"
                                >
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}