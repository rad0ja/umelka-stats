'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlayerMatchDetail } from "@/app/types";

type TeamData = {
    teamA: string[];
    teamB: string[];
    teamAIds: string[];
    teamBIds: string[];
};

export function MatchAccordion({ matches, playerId }: { matches: PlayerMatchDetail[], playerId: string }) {
    const [openMatchId, setOpenMatchId] = useState<string | null>(null);
    const [teamsData, setTeamsData] = useState<Record<string, TeamData>>({});
    const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);
    console.log(matches)

    const toggleAccordion = async (id: string) => {
        if (openMatchId === id) {
            setOpenMatchId(null);
            return;
        }

        if (!teamsData[id]) {
            setLoadingMatchId(id);

            const { data: matchData } = await supabase
                .from("matches")
                .select("*")
                .eq("id", id)
                .single();

            if (matchData) {
                const { data: playersData } = await supabase
                    .from("players")
                    .select("id, name");

                const getNames = (ids: string[]) =>
                    playersData
                        ?.filter((p) => ids.includes(p.id))
                        .map((p) => p.name) || [];

                setTeamsData((prev) => ({
                    ...prev,
                    [id]: {
                        teamA: getNames(matchData.team_a),
                        teamB: getNames(matchData.team_b),
                        teamAIds: matchData.team_a,
                        teamBIds: matchData.team_b,
                    },
                }));
            }

            setLoadingMatchId(null);
        }

        setOpenMatchId(id);
    };

    return (
        <ul className="space-y-4">
            {matches.map((match) => {
                const teamInfo = teamsData[match.match_id];
                const playerInA = teamInfo?.teamAIds?.includes(playerId);
                const playerInB = teamInfo?.teamBIds?.includes(playerId);

                // Determine if this player's team won/lost
                const playerWon =
                    (playerInA && match.team_result === "Win") ||
                    (playerInB && match.team_result === "Win");

                return (
                    <li
                        key={match.match_id}
                        className="border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800"
                    >
                        {/* Accordion Header */}
                        <button
                            className="w-full flex justify-between items-center p-4 text-left"
                            onClick={() => toggleAccordion(match.match_id)}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{match.date}</span>
                                <span className="font-medium">Score: {match.score}</span>
                            </div>
                            <div className="flex items-center gap-3">
                <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                        match.team_result === "Win"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                  {match.team_result}
                </span>
                                <span className="font-medium">⚽ {match.goals_scored}</span>
                                <span
                                    className={`transform transition-transform duration-300 ${
                                        openMatchId === match.match_id ? "rotate-180" : ""
                                    }`}
                                >
                  ▼
                </span>
                            </div>
                        </button>

                        {/* Accordion Content */}
                        {openMatchId === match.match_id && (
                            <div className="px-4 pb-4 border-t border-gray-300 text-sm">
                                {loadingMatchId === match.match_id ? (
                                    <p className="text-gray-500">Loading match info...</p>
                                ) : (
                                    <>
                                        {/* Team A */}
                                        <div
                                            className={`p-2 rounded mb-2 ${
                                                teamInfo?.teamAIds.includes(playerId)
                                                    ? playerWon
                                                        ? "bg-green-100 dark:bg-green-800"
                                                        : "bg-red-100 dark:bg-red-800"
                                                    : ""
                                            }`}
                                        >
                                            <p className="mb-1 font-semibold">👥 Team A:</p>
                                            <ul className="list-disc ml-5">
                                                {teamInfo?.teamA.map((name, idx) => (
                                                    <li
                                                        key={name}
                                                        className={
                                                            teamInfo?.teamAIds[idx] === playerId
                                                                ? "font-bold text-blue-600"
                                                                : ""
                                                        }
                                                    >
                                                        {name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Team B */}
                                        <div
                                            className={`p-2 rounded ${
                                                teamInfo?.teamBIds.includes(playerId)
                                                    ? playerWon
                                                        ? "bg-green-100 dark:bg-green-800"
                                                        : "bg-red-100 dark:bg-red-800"
                                                    : ""
                                            }`}
                                        >
                                            <p className="mb-1 font-semibold">👥 Team B:</p>
                                            <ul className="list-disc ml-5">
                                                {teamInfo?.teamB.map((name, idx) => (
                                                    <li
                                                        key={name}
                                                        className={
                                                            teamInfo?.teamBIds[idx] === playerId
                                                                ? "font-bold text-blue-600"
                                                                : ""
                                                        }
                                                    >
                                                        {name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
