'use client';

import { useEffect, useState } from 'react';
import { getAllMVPs } from '@/app/utils/getAllMVPs';
import { supabase } from '@/lib/supabase';
import MVPDialog from "@/app/components/MVPDialog";
import {useSeason} from "@/app/context/SeasonContext";
import LeagueTable from "@/app/components/LeagueTable";
import { maskName, maskScore } from "@/app/utils/statsMask";

type MVPPlayer = {
    id: string;
    name: string;
    mvpScore: number;
};

export default function MVPScore() {
    const [mvps, setMvps] = useState<MVPPlayer[]>([]);
    const { seasonId } = useSeason();

    useEffect(() => {
        const fetchAndCompute = async () => {
            const { data: playersData, error: playerErr } = await supabase.from('players').select('*');
            const { data: matchesData, error: matchErr } = await supabase.from('matches').select('*').eq("season_id", seasonId);

            if (playerErr || matchErr || !playersData || !matchesData) {
                console.error('Error loading data', { playerErr, matchErr });
                return;
            }

            const allMVPs = getAllMVPs(playersData, matchesData)
                .map((p) => ({ ...p, name: maskName(p.name), mvpScore: maskScore(p.mvpScore, `mvp:${p.id}`) }));
            const sorted = allMVPs.sort((a, b) => b.mvpScore - a.mvpScore);
            const nonZero = sorted.filter((p) => p.mvpScore > 0);
            setMvps(nonZero);
        };

        fetchAndCompute();
    }, [seasonId]);

    return (
        <LeagueTable
            title="🐐 MVP (aka THE GOAT)"
            unit="Points"
            action={<MVPDialog />}
            rows={mvps.map((p) => ({ id: p.id, name: p.name, value: p.mvpScore.toFixed(1) }))}
        />
    );
}
