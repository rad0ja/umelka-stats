import React from 'react';
import Image from 'next/image';
import MatchSummary from "@/app/components/MatchSummary";
import { Player, Match } from "@/app/types";


type Props = {
    match: Match,
    players: Player[],
    isExpanded: boolean,
    onToggle: () => void
}

// Use Props type for MatchCard to include both match and players
const MatchCard = ({ match, players, isExpanded, onToggle }: Props) => {
    return (
        <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assets/teamA.png"
                            alt="Zeleni Logo"
                            width={64}
                            height={64}
                            className="w-24 h-24"
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="sm:text-xl text-s font-bold">
                            {match.score_a} - {match.score_b}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{match.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Image
                            src="/assets/teamB.png"
                            alt="Zeleni Logo"
                            width={64}
                            height={64}
                            className="w-24 h-24"
                        />
                    </div>
                </div>

                {isExpanded && (
                    <MatchSummary match={match} players={players} />
                )}
            </div>
        </div>
    );
};

type Props1 = {
    match:Match[],
    players: Player[]
}

export default function MatchResults({ match, players }: Props1) {
    // Example usage with sample data
    const sampleMatches: Match[] = [
        {
            id: '1',
            date: '2024-09-13',
            team_a: [],
            team_b: ["Nott'm Forest"],
            score_a: 3,
            score_b: 0,
            goals: { 'Arsenal': 3, "Nott'm Forest": 0 }
        },
        {
            id: '2',
            date: '2024-09-21',
            team_a: ['Arsenal'],
            team_b: ['Man City'],
            score_a: 1,
            score_b: 1,
            goals: { 'Arsenal': 1, 'Man City': 1 }
        },
        {
            id: '3',
            date: '2024-09-28',
            team_a: ['Newcastle'],
            team_b: ['Arsenal'],
            score_a: 1,
            score_b: 2,
            goals: { 'Newcastle': 1, 'Arsenal': 2 }
        }
    ];

    const displayMatches = match.length > 0 ? match.slice(0,3) : sampleMatches;

    const [expandedId, setExpandedId] = React.useState<string | null>(displayMatches[0]?.id ?? null);

    if (displayMatches.length === 0) {
        return (
            <div className="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
                <p className="text-center text-gray-500">No matches to display</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {displayMatches.map((m) => (
                <MatchCard
                    key={m.id}
                    match={m}
                    players={players}
                    isExpanded={expandedId === m.id}
                    onToggle={() => setExpandedId(expandedId === m.id ? null : m.id)}
                />
            ))}
        </div>
    );
};