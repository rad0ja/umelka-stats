'use client'

import { Bell } from 'lucide-react';
import { PlayerStats } from './types';

interface HeaderProps {
    playerStats: PlayerStats;
}

export default function Header({ playerStats }: HeaderProps) {
    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 pt-safe">
            <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <div className="text-white font-bold text-xl">⚽</div>
                    </div>
                    <button className="relative p-2">
                        <Bell className="w-6 h-6 text-gray-700" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="text-sm text-gray-500">{playerStats.name}</p>
            </div>
        </div>
    );
}
