'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Player } from "@/app/types";
import { supabase } from "@/lib/supabase";

export function usePlayerCalculatedScore(seasonId?: string) {
    const { id } = useParams();
    const playerId = id as string;

    const [playerCalc, setPlayer] = useState<Player | null>(null);
    const [goalsCalc, setGoals] = useState(0);
    const [winsCalc, setWins] = useState(0);
    const [matchesPlayedCalc, setMatchesPlayed] = useState(0);
    const [drawsCalc, setDraws] = useState(0);
    const [goalTarget, setGoalTarget] = useState(30);

    useEffect(() => {
        console.log("🔍 Fetching usePlayer");
        const fetchPlayerData = async () => {
            const { data: playersData } = await supabase.from('players').select('*');
            const { data: matchesData } = await supabase
                .from("matches")
                .select("*")
                .eq("season_id", seasonId); // 👈 scope to season

            if (!playersData) return;

            const foundPlayer = playersData.find(p => p.id === playerId);
            if (!foundPlayer) return;

            setPlayer(foundPlayer);

            if (!matchesData) return;

            let g = 0, w = 0, mp = 0, d = 0;

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

                if (match.score_a == match.score_b) d += 1;
            });

            setGoals(g);
            setWins(w);
            setMatchesPlayed(mp);
            setDraws(d);

            // pull goalTarget from DB
            if (foundPlayer.goal_target) {
                setGoalTarget(foundPlayer.goal_target);
            }
        };

        fetchPlayerData();
    }, [playerId, seasonId]);

    const updateGoalTarget = async (newTarget: number) => {
        setGoalTarget(newTarget);
        await supabase
            .from('players')
            .update({ goalTarget: newTarget })
            .eq('id', playerId);
    };

    return { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc, goalTarget, drawsCalc,  updateGoalTarget }
}