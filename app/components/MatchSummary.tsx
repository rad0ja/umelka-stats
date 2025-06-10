'use client';

import {Match, Player} from "@/app/types";
import { getPlayerName } from "@/app/utils/playerHelpers";
import RecentFormBadge from "@/app/components/RecentFormBadge";
import { getRecentForm } from "@/app/utils/form-utils";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

type Props = {
    match: Match;
    players: Player[];
};

export default function MatchSummary({ match, players }: Props) {
    const { matches } = usePlayerMatchData();
    const recentForm = getRecentForm(matches, players.map(p => p.id));


    const renderTeam = (team: string[]) => (
        <table className="w-full text-sm border border-gray-300 dark:border-white dark:border-gray-600 text-gray-800 dark:text-gray-100">
            <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b">
                <th className="p-2 text-left dark:border-white">Player</th>
                <th className="p-2 text-left">Goals</th>
            </tr>
            </thead>
            <tbody>
            {team.map((playerId) => (
                <tr key={playerId} className="border-b">
                    <td className="p-2 dark:border-white">
                        <span>{getPlayerName(players, playerId)}</span>
                        <span><RecentFormBadge form={recentForm[playerId] || []}/></span>
                    </td>
                    <td className="p-2">{match.goals[playerId] || 0}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 dark:border-gray-600 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
            <h2 className="text-xl font-semibold text-center mb-2">Last Match Summary</h2>
            <div className="text-center text-2xl font-bold mb-4">
                <span className="text-base">Team A</span> {match.score_a} : {match.score_b}{' '}
                <span className="text-base">Team B</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-center mb-2">Team A</h3>
                    {renderTeam(match.team_a)}
                </div>
                <div>
                    <h3 className="font-semibold text-center mb-2">Team B</h3>
                    {renderTeam(match.team_b)}
                </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
                {new Date(match.date).toLocaleDateString()}
            </p>
        </div>
    );
}