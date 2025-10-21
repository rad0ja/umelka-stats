'use client';

import {useAuthGuard} from "@/app/hooks/useAuthGuard";
import {usePlayerMatchData} from "@/app/hooks/usePlayerMatchData";
import LiveMatchFlow from "@/app/components/LiveMatchFlow";

export default function AddMatchPage() {
    const { user, loading } = useAuthGuard();
    const { players } = usePlayerMatchData();

    if (loading) return <p className="text-center mt-10">Checking authentication...</p>;
    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <LiveMatchFlow players={players} />
        </div>
    );
}
