'use client';

import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getLastMatch } from "@/app/utils/playerHelpers";
import MatchSummary from "@/app/components/MatchSummary";
import TopScorers from "@/app/components/TopScorers";
import Link from "next/link";
import MostWins from "@/app/components/MostWins";
import FeedbackForm from "@/app/components/FeedbackForm";
import SeasonPicker from "@/app/components/SeasonPicker";
import MatchCard from "@/app/components/MatchCard";
import Navbar from "@/app/components/header/NavBar";

export default function Dashboard() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins } = usePlayerStats(matches);
    const lastMatch = getLastMatch(matches);

    const navigationLinks = [
        { label: 'Home', href: '/',icon: '🏠' },
        { label: 'Matches', href: '/matches', icon: '🏠' },
        { label: 'About', href: '/about', icon: '🏠' },
        { label: 'Contact', href: '/contact', icon: '🏠' },
    ];

    if (loading) return <div className="text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Navbar links={navigationLinks} logoText="ReactApp" />
            <h1 className="text-2xl font-bold mb-6 text-center">Ultimate Dashboard</h1>
            <SeasonPicker />
            {lastMatch && <MatchSummary match={lastMatch} players={players}/>}

            <div className="text-center mb-6">
                <Link href={"/matches"}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View All Matches
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TopScorers
                    goals={goals}
                    players={players}
                    showAll={false}
                />

                <MostWins
                    wins={wins}
                    players={players}
                    showAll={false}
                />
            </div>

            <div className="text-center mb-6 mt-6">
                <Link href={"/stats"}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View Complete Stats
                </Link>
            </div>
            {/*<FeedbackForm />*/}
        </div>
    );
}
