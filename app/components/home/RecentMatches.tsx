import React from 'react';
import { HomeMatch, HomeMatchStatus } from "@/app/types";
import { Calendar, ChevronRight, MapPin } from 'lucide-react';

interface RecentMatchesProps {
    matches: HomeMatch[];
}

const RecentMatches: React.FC<RecentMatchesProps> = ({ matches }) => {
    const getStatusColor = (status: HomeMatchStatus): string => {
        switch(status) {
            case 'win': return 'bg-green-100 text-green-700 border-green-300';
            case 'loss': return 'bg-red-100 text-red-700 border-red-300';
            case 'draw': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusText = (status: HomeMatchStatus): string => {
        switch(status) {
            case 'win': return 'Victory';
            case 'loss': return 'Defeat';
            case 'draw': return 'Draw';
            default: return '';
        }
    };

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
                <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid gap-4 md:gap-6">
                {matches.map((match: HomeMatch) => (
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
    );
};

export default RecentMatches;
