"use client";
import { Season, useSeason } from "@/app/context/SeasonContext";

export const getSeasonName = (seasons: Season[], id: string | null) => seasons.find((s) => s.id === id)?.name ?? "";

export default function SeasonPicker() {
    const { seasonId, setSeasonId, seasons } = useSeason();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeasonId(e.target.value);
    };

    return (
        <div className="flex justify-center items-center">
            <select
                aria-label="Season"
                value={seasonId ?? ""}
                onChange={handleChange}
                className="rounded-full border border-line bg-surface text-foreground font-semibold py-2 pl-4 pr-8 shadow-sm"
            >
                <option value="" disabled>Select season</option>
                {seasons.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>
        </div>
    );
}
