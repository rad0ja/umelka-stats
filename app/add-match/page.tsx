'use client';

import MatchForm from '@/app/components/MatchForm';
import {useAuthGuard} from "@/app/hooks/useAuthGuard";

export default function AddMatchPage() {
    const { user, loading } = useAuthGuard();

    if (loading) return <p className="text-center mt-10">Checking authentication...</p>;
    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Enter Match Details</h1>
            <MatchForm />
        </div>
    );
}
