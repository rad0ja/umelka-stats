'use client';

import Dashboard from "@/app/components/Dashborad";
import {useSeason} from "@/app/context/SeasonContext";
import SeasonPicker from "@/app/components/SeasonPicker";

export default function HomePage() {
    const { seasonId } = useSeason();

    if (!seasonId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
                <h1 className="font-display text-4xl font-extrabold italic text-center">Pick your season</h1>
                <SeasonPicker />
            </div>
        )
    }

  return (
      <div>
        <Dashboard />
      </div>
  );
}
