import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Match, Player} from "@/app/types";

export function usePlayerMatchData() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const {data: playersData} = await supabase.from('players').select('*');
            const {data: matchesData} = await supabase.from('matches').select('*');

            if (playersData) setPlayers(playersData);
            if (matchesData) setMatches(matchesData as Match[]);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { players, matches, loading}
}

