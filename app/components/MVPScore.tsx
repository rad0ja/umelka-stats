'use client';

import { useEffect, useState } from 'react';
import { getAllMVPs } from '@/app/utils/getAllMVPs';
import { supabase } from '@/lib/supabase';
import {getTrophy} from "@/app/utils/playerHelpers";

type MVPPlayer = {
    id: string;
    name: string;
    mvpScore: number;
};

export default function MVPScore() {
    const [mvps, setMvps] = useState<MVPPlayer[]>([]);

    useEffect(() => {
        const fetchAndCompute = async () => {
            const { data: playersData, error: playerErr } = await supabase.from('players').select('*');
            const { data: matchesData, error: matchErr } = await supabase.from('matches').select('*');

            if (playerErr || matchErr || !playersData || !matchesData) {
                console.error('Error loading data', { playerErr, matchErr });
                return;
            }

            const allMVPs = getAllMVPs(playersData, matchesData);
            const sorted = allMVPs.sort((a, b) => b.mvpScore - a.mvpScore);
            setMvps(sorted);
        };

        fetchAndCompute();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🐐 MVP (aka THE GOAT)</h2>

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
