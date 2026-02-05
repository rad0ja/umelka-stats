"use client";
import { createContext, useContext, useEffect, useState, startTransition } from "react";
import { setSeason } from "@/app/actions"

type SeasonContextType = {
    seasonId: string | null;
    setSeasonId: (id: string) => void;
};

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
    const [seasonId, setSeasonIdState] = useState<string | null>(null);

    useEffect(() => {
        const stored = document.cookie
            .split("; ")
            .find(row => row.startsWith("seasonId="))
            ?.split("=")[1];

        if (stored) setSeasonIdState(stored);
    }, []);

    function setSeasonId(id: string) {
        setSeasonIdState(id);

        startTransition(() => {
            setSeason(id); // server action
        });
    }

    return (
        <SeasonContext.Provider value={{ seasonId, setSeasonId }}>
            {children}
        </SeasonContext.Provider>
    );
}

export function useSeason() {
    const ctx = useContext(SeasonContext);
    if (!ctx) throw new Error("useSeason must be used within SeasonProvider");
    return ctx;
}
