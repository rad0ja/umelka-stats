// context/SeasonContext.tsx
"use client";
import {createContext, useContext, useEffect, useState} from "react";
import { supabase } from "@/lib/supabase";

export type Season = {
    id: string;
    name: string;
};

type SeasonContextType = {
    seasonId: string | null;
    setSeasonId: (id: string) => void;
    seasons: Season[];
};

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
    const [seasonId, setSeasonId] = useState<string | null>(null);
    const [seasons, setSeasons] = useState<Season[]>([]);

    useEffect(() => {
        const fetchSeasons = async () => {
            const { data, error } = await supabase.from("seasons").select("id, name").order("id");
            if (error) {
                console.error("Failed to load seasons:", error);
                return;
            }
            // ids are numeric in the DB but the rest of the app keeps seasonId as a string
            setSeasons((data ?? []).map((s) => ({ id: String(s.id), name: s.name })));
        };
        fetchSeasons();
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("seasonId");
        if (stored) setSeasonId(stored);
    }, []);

    useEffect(() => {
        if (seasonId) {
            localStorage.setItem("seasonId", seasonId);
        }
    }, [seasonId]);

    return (
        <SeasonContext.Provider value={{ seasonId, setSeasonId, seasons }}>
            {children}
        </SeasonContext.Provider>
    );
}

export function useSeason() {
    const ctx = useContext(SeasonContext);
    if (!ctx) throw new Error("useSeason must be used within SeasonProvider");
    return ctx;
}
