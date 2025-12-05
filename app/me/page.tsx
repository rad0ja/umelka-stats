'use client';

import useMyData from '@/app/hooks/useMyData';
import LogoutButton from "@/app/components/login/LogoutButton";
import {usePlayerCalculatedScore} from "@/app/hooks/usePlayerCalculatedScore";

export default function MyProfilePage() {
    const { player } = useMyData();
    const { goalsCalc, winsCalc } = usePlayerCalculatedScore();

    if (!player) return <div>You must be logged in as a player to see this.</div>;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">{player.user_id} — My Profile</h1>
            <LogoutButton />

            <div className="bg-gray-100 p-3 rounded">
                <strong>Total Goals:</strong> {goalsCalc} - {winsCalc}
            </div>

        </div>
    );
}
