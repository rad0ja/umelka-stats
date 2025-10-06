// context/SeasonContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type SeasonContextType = {
    seasonId: string | null;
    setSeasonId: (id: string) => void;
};

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
    const [seasonId, setSeasonId] = useState<string | null>(null);

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
