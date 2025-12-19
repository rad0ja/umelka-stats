import Navigation from "@/app/components/home/Navigation";
import WelcomeSection from "@/app/components/home/WelcomeSection";
import RecentMatches from "@/app/components/home/RecentMatches";
import UpcomingEvents from "@/app/components/home/UpcomingEvents";
import PlayerStatsSection from "@/app/components/home/PlayerStatsSection";
import {HomeMatch, HomeEvent, Match} from "@/app/types";
import { cookies } from "next/headers";
import { getPlayerStatsForSeason } from "@/app/data/singlePlayerStats";
import { Suspense } from "react";
import { PlayerStatsSkeleton } from "@/app/components/home/PlayerStatsSkeleton";


export default async function FotbalekHomepage() {
    const seasonId = (await cookies()).get('seasonId')?.value

    const data = await getPlayerStatsForSeason(seasonId)
    if (!data) return null


    console.log(data);


    const recentMatches: HomeMatch[] = [
        {
            id: 1,
            team1: "Green Eagles",
            team2: "Blue Sharks",
            score1: 3,
            score2: 2,
            date: "Nov 29, 2024",
            location: "Central Park Field",
            status: "win"
        },
        {
            id: 2,
            team1: "Red Dragons",
            team2: "Green Eagles",
            score1: 1,
            score2: 1,
            date: "Nov 26, 2024",
            location: "Riverside Stadium",
            status: "draw"
        },
        {
            id: 3,
            team1: "Green Eagles",
            team2: "Yellow Tigers",
            score1: 2,
            score2: 4,
            date: "Nov 23, 2024",
            location: "Downtown Arena",
            status: "loss"
        }
    ];

    const upcomingEvents: HomeEvent[] = [
        {
            id: 1,
            title: "Friendly Match",
            opponent: "White Knights",
            date: "Dec 5, 2024",
            time: "18:00",
            location: "North Field",
            players: 12,
            needed: 14
        },
        {
            id: 2,
            title: "League Game",
            opponent: "Black Panthers",
            date: "Dec 8, 2024",
            time: "15:30",
            location: "Main Stadium",
            players: 14,
            needed: 14
        },
        {
            id: 3,
            title: "Training Session",
            opponent: null,
            date: "Dec 10, 2024",
            time: "19:00",
            location: "Practice Ground",
            players: 8,
            needed: 20
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <WelcomeSection userName={data.player.name} />
                <RecentMatches matches={recentMatches} />
                <UpcomingEvents events={upcomingEvents} />
                <Suspense fallback={<PlayerStatsSkeleton />}>
                    <PlayerStatsSection  />
                </Suspense>
            </div>
        </div>
    );
}