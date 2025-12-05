'use client'

import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";

export default function useMyData() {
    const [player, setPlayer] = useState<any>(null);


    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user === null) return;

            const { data } = await supabase.from('players').select('*').eq('user_id', user.id).single();
            setPlayer(data);
        };
        load();
    }, []);

    return { player }
}