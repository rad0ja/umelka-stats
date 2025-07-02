'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Player } from "@/app/types";
import { supabase } from "@/lib/supabase";

export function usePlayerCalculatedScore() {
    const { id } = useParams();
    const playerId = id as string;

    const [player, setPlayer] = useState<Player | null>(null);
    const [goals, setGoals] = useState(0);
    const [wins, setWins] = useState(0);
    const [matchesPlayed, setMatchesPlayed] = useState(0);

    useEffect(() => {
        const fetchPlayerData = async () => {
            const { data: playersData } = await supabase.from('players').select('*');
            const { data: matchesData } = await supabase.from('matches').select('*');

            if (!playersData || !matchesData) return;

            const foundPlayer = playersData.find(p => p.id === playerId);
            if (!foundPlayer) return;

            setPlayer(foundPlayer);

            let g = 0, w = 0, mp = 0;

            matchesData.forEach(match => {
                const inTeamA = match.team_a.includes(playerId);
                const inTeamB = match.team_b.includes(playerId);
                const played = inTeamA || inTeamB;

                if (played) mp += 1;

                if (match.goals[playerId]) g += match.goals[playerId];

                const won =
                    (inTeamA && match.score_a > match.score_b) ||
                    (inTeamB && match.score_b > match.score_a);

                if (won) w += 1;
            });

            setGoals(g);
            setWins(w);
            setMatchesPlayed(mp);
        };

        fetchPlayerData();
    }, [playerId]);

    return { player, goals, matchesPlayed, wins }
}