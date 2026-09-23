'use client';

import { useMemo } from "react";
import { Match } from "@/app/types";
import { maskRecord, STATS_HIDDEN } from "@/app/utils/statsMask";

export function usePlayerStats(matches: Match[]) {
    return useMemo(() => {
        let goals: Record<string, number> = {};
        let wins: Record<string, number> = {};
        let appearances: Record<string, number> = {};
        let assists: Record<string, number> = {};

        const allPlayersIds = new Set<string>();

        matches.forEach((match) => {
            // Count goals
            for (const [playerId, goalCount] of Object.entries(match.goals)) {
                goals[playerId] = (goals[playerId] || 0) + goalCount;
                allPlayersIds.add(playerId);
            }

            // Count goals assists
            for (const [playerId, assistCount] of Object.entries(match.assists)) {
                assists[playerId] = (assists[playerId] || 0) + assistCount;
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
            if (!(playerId in assists)) assists[playerId] = 0;
        });

        if (STATS_HIDDEN) {
            goals = maskRecord(goals, 'goals');
            assists = maskRecord(assists, 'assists');
            appearances = maskRecord(appearances, 'appearances');
            for (const id in appearances) {
                appearances[id] = Math.min(Math.max(appearances[id], 1), matches.length);
            }
            wins = maskRecord(wins, 'wins');
            for (const id in wins) {
                wins[id] = Math.min(wins[id], appearances[id] || 0);
            }
        }

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
            return (goal / played).toFixed(1)
        }

        const getAssistsPerGame = (id: string) => {
            const assist = assists[id] || 0;
            const played = appearances[id] || 0;
            if (played == 0) return '0';
            return (assist / played).toFixed(1)
        }

        const matchesPlayedRatio = (id: string) => {
            const played = appearances[id] || 0;
            if (matches.length === 0) return '0%';
            return `${((played / matches.length) * 100).toFixed(1)}%`;
        }

        const canadianPointsTotal = (id: string) => {
            const goal = goals[id] || 0;
            const assist = assists[id] || 0;
            return goal + assist;
        }

        const getCanadianPointsPerGame = (id: string) => {
            const canadianPoints = canadianPointsTotal(id);
            const played = appearances[id] || 0;
            if (played == 0) return '0';
            return `${(canadianPoints / played).toFixed(1)} PPG`;
        };

        return {
            goals,
            wins,
            appearances,
            getWinRatio,
            getGoalsPerGame,
            matchesPlayedRatio,
            canadianPointsTotal,
            assists,
            getCanadianPointsPerGame,
            getAssistsPerGame
        };
    }, [matches]);
}