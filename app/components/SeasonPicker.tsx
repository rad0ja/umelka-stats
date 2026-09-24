"use client";
import { useSeason } from "@/app/context/SeasonContext";

// Array (not object) so the picker keeps this order; integer-like object keys get sorted numerically
export const SEASONS = [
    { id: "6", name: "Umelka 2025" },
    { id: "5", name: "Salovka 2025/2026" },
    { id: "7", name: "Umelka 2026" },
];

export const getSeasonName = (id: string | null) => SEASONS.find((s) => s.id === id)?.name ?? "";

export default function SeasonPicker() {
    const { seasonId, setSeasonId } = useSeason();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeasonId(e.target.value);
    };

    return (
        <div className="p-4 flex justify-center items-center">
            <select value={seasonId ?? ""} onChange={handleChange} className="block w-50 rounded-lg border border-gray-300 py-2 px-3 dark:bg-black dark:text-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                <option value="" disabled>Select season</option>
                {SEASONS.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>
        </div>
    );
}
