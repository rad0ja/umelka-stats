// hooks/usePlayerMatchData.ts
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSeason } from "@/app/context/SeasonContext";

export function usePlayerMatchData() {
    const { seasonId } = useSeason();
    const [players, setPlayers] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!seasonId) return; // wait until a season is chosen

        const fetchData = async () => {
            setLoading(true);

            const { data: playersData } = await supabase.from("players").select("*");
            const { data: matchesData } = await supabase
                .from("matches")
                .select("*")
                .eq("season_id", seasonId); // 👈 scope to season

            setPlayers(playersData || []);
            setMatches(matchesData || []);
            setLoading(false);
        };

        fetchData();
    }, [seasonId]); // 👈 re-run whenever season changes

    return { players, matches, loading };
}
