'use client'

import { Home, Calendar, Users, Trophy } from 'lucide-react';

interface BottomNavigationProps {
    activeTab: 'home' | 'matches' | 'teams' | 'stats';
    onTabChange: (tab: 'home' | 'matches' | 'teams' | 'stats') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16 px-4">
                <button
                    onClick={() => onTabChange('home')}
                    className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-xs font-medium">Home</span>
                </button>
                <button
                    onClick={() => onTabChange('matches')}
                    className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'matches' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                    <Calendar className="w-6 h-6" />
                    <span className="text-xs font-medium">Matches</span>
                </button>
                <button
                    onClick={() => onTabChange('teams')}
                    className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'teams' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                    <Users className="w-6 h-6" />
                    <span className="text-xs font-medium">Teams</span>
                </button>
                <button
                    onClick={() => onTabChange('stats')}
                    className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'stats' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                    <Trophy className="w-6 h-6" />
                    <span className="text-xs font-medium">Stats</span>
                </button>
            </div>
        </div>
    );
}
