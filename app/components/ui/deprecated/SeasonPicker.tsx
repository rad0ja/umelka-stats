"use client";
import { useSeason } from "@/app/context/SeasonContext";

export default function SeasonPicker() {
    const { seasonId, setSeasonId } = useSeason();

    const selectSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeasonId(e.target.value);
    };

    return (
        <div className="p-4 flex justify-center items-center">
            <select value={seasonId ?? ""} onChange={selectSeason} className="block w-50 rounded-lg border border-gray-300 py-2 px-3 dark:bg-black dark:text-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                <option value="" disabled>Select season</option>
                <option value="1">Umelka 2025</option>
                <option value="2">Salovka 2025/2026</option>
            </select>
        </div>
    );
}
