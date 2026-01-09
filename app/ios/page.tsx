'use client'

import { useState } from 'react';
import Header from '../components/ios/Header';
import StatsCards from '../components/ios/StatsCards';
import RecentMatches from '../components/ios/RecentMatches';
import UpcomingEvents from '../components/ios/UpcomingEvents';
import BottomNavigation from '../components/ios/BottomNavigation';
import { Event, PlayerStats } from '../components/ios/types';

export default function FotbalekHomepage() {
    const [currentPlayerId] = useState<string>("player1");
    const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'teams' | 'stats'>('home');

    const upcomingEvents: Event[] = [
        {
            id: 1,
            title: "Friendly Match",
            opponent: "White Knights",
            date: "2024-12-05",
            time: "18:00",
            location: "North Field",
            players: 12,
            needed: 14
        },
        {
            id: 2,
            title: "League Game",
            opponent: "Black Panthers",
            date: "2024-12-08",
            time: "15:30",
            location: "Main Stadium",
            players: 14,
            needed: 14
        }
    ];

    const playerStats: PlayerStats = {
        name: "John Doe",
        avatar: "JD",
        stats: [
            { label: "Matches", value: 28, icon: "⚽" },
            { label: "Goals", value: 12, icon: "⚽" },
            { label: "Assists", value: 8, icon: "🎯" },
            { label: "Win Rate", value: "64%", icon: "🏆" }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 sm:max-w-4xl sm:mx-auto sm:p-6 pt-safe">
            <Header playerStats={playerStats} />

            <div className="px-4 pb-24 space-y-6 mt-4">
                <StatsCards playerStats={playerStats} />
                <RecentMatches currentPlayerId={currentPlayerId} />
                <UpcomingEvents events={upcomingEvents} />
            </div>

            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}