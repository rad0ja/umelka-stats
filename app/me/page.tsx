'use client';

import LogoutButton from "@/app/components/LogoutButton";
import {usePlayerCalculatedScore} from "@/app/hooks/usePlayerCalculatedScore";

export default function MyProfilePage() {
    const { goalsCalc, winsCalc } = usePlayerCalculatedScore();


    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold"> — My Profile</h1>
            <LogoutButton />

            <div className="bg-gray-100 p-3 rounded">
                <strong>Total Goals:</strong> {goalsCalc} - {winsCalc}
            </div>

        </div>
    );
}
