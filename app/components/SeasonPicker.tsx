"use client";
import { Season, useSeason } from "@/app/context/SeasonContext";

export const getSeasonName = (seasons: Season[], id: string | null) => seasons.find((s) => s.id === id)?.name ?? "";

export default function SeasonPicker() {
    const { seasonId, setSeasonId, seasons } = useSeason();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeasonId(e.target.value);
    };

    return (
        <div className="p-4 flex justify-center items-center">
            <select value={seasonId ?? ""} onChange={handleChange} className="block w-50 rounded-lg border border-gray-300 py-2 px-3 dark:bg-black dark:text-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                <option value="" disabled>Select season</option>
                {seasons.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>
        </div>
    );
}
