'use client';

import { useMemo } from "react";
import { Match } from "@/app/types";

export function usePlayerStats(matches: Match[]) {
    return useMemo(() => {
        const goals: Record<string, number> = {};
        const wins: Record<string, number> = {};
        const appearances: Record<string, number> = {};

        const allPlayersIds = new Set<string>();

        matches.forEach((match) => {
            // Count goals
            for (const [playerId, goalCount] of Object.entries(match.goals)) {
                goals[playerId] = (goals[playerId] || 0) + goalCount;
                allPlayersIds.add(playerId);
            }

            // Count appearances
            [...match.team_a, ...match.team_b].forEach((playerId) => {
                appearances[playerId] = (appearances[playerId] || 0) + 1;
            });

            // Count wins
            let winningTeam: string[] = [];
            if (match.score_a > match.score_b) winningTeam = match.team_a;
            else if (match.score_b > match.score_a) winningTeam = match.team_b;

            winningTeam.forEach((playerId) => {
                wins[playerId] = (wins[playerId] || 0) + 1;
                allPlayersIds.add(playerId);
            });
        });

        allPlayersIds.forEach((playerId) => {
            if (!(playerId in wins)) wins[playerId] = 0;
            if (!(playerId in goals)) goals[playerId] = 0;
        });

        const getWinRatio = (id: string) => {
            const win = wins[id] || 0;
            const played = appearances[id] || 0;
            if (played == 0) return '0%';
            return `${((win / played) * 100).toFixed(1)}%`;
        };

        const getGoalsPerGame = (id: string) => {
            const goal = goals[id] || 0;
            const played = appearances[id] || 0;
            if (played == 0) return '0';
            return `${(goal / played).toFixed(1)} goals`
        }

        return {
            goals,
            wins,
            appearances,
            getWinRatio,
            getGoalsPerGame
        };
    }, [matches]);
}