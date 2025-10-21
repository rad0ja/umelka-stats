'use client';

import { useEffect, useState } from 'react';
import { getAllMVPs } from '@/app/utils/getAllMVPs';
import { supabase } from '@/lib/supabase';
import { getTrophy } from "@/app/utils/playerHelpers";
import MVPDialog from "@/app/components/MVPDialog";
import {useSeason} from "@/app/context/SeasonContext";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";

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

            const allMVPs = getAllMVPs(playersData, matchesData);
            const sorted = allMVPs.sort((a, b) => b.mvpScore - a.mvpScore);
            const nonZero = sorted.filter((p) => p.mvpScore > 0);
            setMvps(nonZero);
        };

        fetchAndCompute();
    }, [seasonId]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">🐐 MVP (aka THE GOAT)
                <MVPDialog />
            </h2>

            <ul className="space-y-1">
                {mvps.map((player, index) => (
                    <li
                        key={player.id}
                        className="flex justify-between border-b py-1"
                    >
                        <div>
                            <span className="font-medium">{getTrophy(index)} {player.name}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-white">
              {player.mvpScore.toFixed(1)}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
