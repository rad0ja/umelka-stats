'use client'

import { PlayerStats } from './types';

interface StatsCardsProps {
    playerStats: PlayerStats;
}

export default function StatsCards({ playerStats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {playerStats.stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl p-3 shadow-sm"
                >
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
