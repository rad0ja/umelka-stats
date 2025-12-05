'use client'

import { useEffect, useState } from "react";
import { Player } from "@/app/types";
import { supabase } from "@/lib/supabase";
import {useSeason} from "@/app/context/SeasonContext";

export function usePlayerCalculatedScore() {
    const { seasonId } = useSeason();

    const [playerCalc, setPlayer] = useState<Player | null>(null);
    const [goalsCalc, setGoals] = useState(0);
    const [winsCalc, setWins] = useState(0);
    const [matchesPlayedCalc, setMatchesPlayed] = useState(0);
    const [drawsCalc, setDraws] = useState(0);
    const [goalTarget, setGoalTarget] = useState(30);

    useEffect(() => {
        console.log("🔍 Fetching usePlayer (authenticated)");
        const fetchPlayerData = async () => {
            // Ensure season is selected
            if (!seasonId) return;

            // Get authenticated user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Load player for the authenticated user
            const { data: foundPlayer } = await supabase
                .from('players')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!foundPlayer) return;

            setPlayer(foundPlayer as Player);

            // Now load matches for the current season
            const { data: matchesData } = await supabase
                .from("matches")
                .select("*")
                .eq("season_id", seasonId); // 👈 scope to season

            if (!matchesData) return;

            const playerId = (foundPlayer as any).id as string;

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
            if ((foundPlayer as any).goal_target) {
                setGoalTarget((foundPlayer as any).goal_target);
            }
        };

        fetchPlayerData();
    }, [seasonId]);

    const updateGoalTarget = async (newTarget: number) => {
        setGoalTarget(newTarget);
        if (!playerCalc?.id) return;
        await supabase
            .from('players')
            .update({ goal_target: newTarget })
            .eq('id', playerCalc.id);
    };

    return { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc, goalTarget, drawsCalc, updateGoalTarget }
}