import React from 'react';
import { HomePlayerStats, HomeStat } from "@/app/types";
import { ChevronRight } from 'lucide-react';

interface PlayerStatsSectionProps {
    playerStats: HomePlayerStats;
}

export default function PlayerStats({ playerStats }: PlayerStatsSectionProps){
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
                <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                    Full Report <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {playerStats.stats.map((stat: HomeStat, index: number) => (
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
    );
};
