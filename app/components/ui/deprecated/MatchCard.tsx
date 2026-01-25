import React from "react";

type Props = {
    scoreA: number,
    scoreB: number,
    matchDate: string
}

export default function MatchCard({ scoreA, scoreB, matchDate }: Props) {
    return (
        <div className="flex items-center justify-center p-4 bg-white">
            {/* Left Team */}
            <div className="flex flex-col items-center w-32">
                <img
                    src="/assets/zeleni.png"
                    alt="Zeleni Logo"
                />
            </div>

            {/* Center Score */}
            <div className="flex flex-col items-center mx-8">
                <span className="text-xs text-gray-500 text-center">{matchDate}</span>
                <span className="text-sm md:text-2xl font-bold text-gray-900">{scoreA} - {scoreB}</span>
            </div>

            {/* Right Team */}
            <div className="flex flex-col items-center w-32">
                <img
                    src="/assets/barevni.png"
                    alt="Barevni Logo"
                />
            </div>
        </div>
    );
};