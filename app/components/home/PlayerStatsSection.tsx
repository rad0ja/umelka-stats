import React from 'react';
import { HomePlayerStats } from "@/app/types";
import { cookies } from "next/headers";
import { getPlayerStatsForSeason } from "@/app/data/singlePlayerStats";
import PlayerStats from "@/app/components/ui/PlayerStats";


export default async function PlayerStatsSection(){
    const seasonId = (await cookies()).get('seasonId')?.value

    const data = await getPlayerStatsForSeason(seasonId)
    if (!data) return null

    const playerStatsData: HomePlayerStats = {
        name: "John Doe",
        avatar: "JD",
        stats: [
            { label: "Matches Played", value: data.stats.matchesPlayed, icon: "🎮" },
            { label: "Goals Scored", value: data.stats.goals, icon: "⚽" },
            { label: "Wins", value: data.stats.wins, icon: "🏆" },
            { label: "GPG", value: data.stats.goalsPerGame, icon: "🏆" },
            { label: "Win Rate", value: data.stats.winRatio, icon: "🏆" }
        ]
    };

    return <PlayerStats playerStats={playerStatsData} />
    };
