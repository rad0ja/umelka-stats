import { PlayerMatchDetail } from "@/app/types";
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar} from 'recharts';
import { playerStreaks } from "@/app/utils/playerStreaks";
import StatCard from "@/app/components/ui/deprecated/StatCard";
import { useState } from "react";
import { MatchAccordion } from "@/app/components/ui/deprecated/MatchAccordion";

type MatchHistory = {
    [playerId: string]: {
        matches: PlayerMatchDetail[];
    };
}

type Props = {
    playerId: string;
    history: MatchHistory;
    allMVPs?: { id: string, name: string, mvpScore:number }[];
}

export default function PlayerMatchHistory({ playerId, history, allMVPs = [] }: Props) {
    const [collapsedChart, setCollapsedChart] = useState(true);

    const playerMatches = history[playerId]?.matches || [];
    const sortedPlayerMatches = [...playerMatches].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const streaks = playerStreaks(sortedPlayerMatches);

    let cumulative = 0;
    const chartData = playerMatches.map(match => {
        cumulative += match.goals_scored;
        return {
            date: match.date,
            goals: match.goals_scored,
            cumulativeGoals: cumulative,
        };
    });

    const playerMVP = allMVPs.find(p => p.id === playerId)?.mvpScore || 0;
    const top3 = [...allMVPs].sort((a, b) => b.mvpScore - a.mvpScore).slice(0, 3);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="🏆 Longest Win Streak" value={streaks.longestWinningStreak}/>
                <StatCard title="💀 Longest Loss Streak" value={streaks.longestLosingStreak}/>
                <StatCard title="🔥 Longest Scoring Streak" value={streaks.longestScoringStreak}/>
                <StatCard title="🥶 Longest No-Scoring Streak" value={streaks.longestNonScoringStreak}/>
            </div>

            {playerMatches.length === 0 ? (
                <p className="text-gray-500">No match history available.</p>
            ) : (
                <>
                    <div className="mb-8 pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">📈 Goals Over Time</h3>
                            <button
                                onClick={() => setCollapsedChart(!collapsedChart)}
                                className="text-sm px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800"
                            >
                                {collapsedChart ? "Expand" : "Collapse"}
                            </button>
                        </div>

                        <div
                            className={`overflow-hidden transition-all duration-500 ${
                                collapsedChart ? "max-h-0 opacity-0" : "max-h-[400px] opacity-100"
                            }`}
                        >
                            <ResponsiveContainer width="100%" height={250}>
                                <ComposedChart
                                    width={500}
                                    height={400}
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <XAxis dataKey="date" tick={{fontSize: 12}}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar
                                        dataKey="goals"
                                        barSize={10}
                                        fill="#413ea0"
                                        name="Goals"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeGoals"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name="Cumulative Goals"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">🏅 MVP Score Comparison</h3>
                        <ul className="space-y-2">
                            {top3.map((player, index) => (
                                <li key={player.id} className="flex justify-between">
                  <span>
                    {index + 1}. {player.name}
                      {player.id === playerId && ' (You)'}
                  </span>
                                    <span className="font-bold">{player.mvpScore.toFixed(1)}</span>
                                </li>
                            ))}
                        </ul>

                        {!top3.find(p => p.id === playerId) && (
                            <p className="mt-2 text-sm">
                                Your MVP score: <span className="font-semibold">{playerMVP.toFixed(1)}</span>
                            </p>
                        )}
                    </div>

                    <h3 className="text-lg font-bold mb-2">📜 Match History</h3>
                    <MatchAccordion matches={sortedPlayerMatches} playerId={playerId}/>
                </>

            )}
        </div>
    );
}