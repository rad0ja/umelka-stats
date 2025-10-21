'use client';

import Dashboard from "@/app/components/Dashborad";
import {useSeason} from "@/app/context/SeasonContext";
import SeasonPicker from "@/app/components/SeasonPicker";

export default function HomePage() {
    const { seasonId } = useSeason();

    if (!seasonId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="text-center text-lg font-medium">
                    👉 Please select a season to continue
                </div>
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
