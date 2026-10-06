'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useSeason } from "@/app/context/SeasonContext";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import SeasonPicker, { getSeasonName } from "@/app/components/SeasonPicker";
import StatCard from "@/app/components/StatCard";
import { getPlayerName, MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";
import { STATS_HIDDEN } from "@/app/utils/statsMask";
import { computeSeasonSummary, MatchRecord, PlayerMatchRecord, PlayerRecord } from "@/app/utils/seasonSummary";
import { Player } from "@/app/types";

const formatDate = (date: string) => new Date(date).toLocaleDateString();

// An "award" shared by half the squad (e.g. everyone who played the only draw) isn't worth showing
const MAX_TIED_WINNERS = 4;

function PlayerLinks({ ids, players }: { ids: string[]; players: Player[] }) {
    return (
        <>
            {ids.map((id, i) => (
                <span key={id}>
                    {i > 0 && ", "}
                    <Link href={`/players/${id}`} className="hover:underline text-blue-800 dark:text-blue-400">
                        {getPlayerName(players, id)}
                    </Link>
                </span>
            ))}
        </>
    );
}

type AwardRowProps = {
    title: string;
    value: string;
    children: React.ReactNode;
    detail?: string;
};

function AwardRow({ title, value, children, detail }: AwardRowProps) {
    return (
        <li className="flex justify-between gap-4 border-b py-2">
            <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
                <div className="font-medium">{children}</div>
                {detail && <div className="text-xs text-gray-500">{detail}</div>}
            </div>
            <span className="text-sm text-gray-600 dark:text-white whitespace-nowrap">{value}</span>
        </li>
    );
}

function PlayerAward({ title, record, players, format }: {
    title: string;
    record: PlayerRecord | null;
    players: Player[];
    format: (value: number) => string;
}) {
    if (!record || record.playerIds.length > MAX_TIED_WINNERS) return null;
    return (
        <AwardRow title={title} value={format(record.value)}>
            <PlayerLinks ids={record.playerIds} players={players} />
        </AwardRow>
    );
}

function MatchAward({ title, record, format }: {
    title: string;
    record: MatchRecord | null;
    format: (value: number) => string;
}) {
    if (!record) return null;
    const { match } = record;
    return (
        <AwardRow title={title} value={format(record.value)} detail={formatDate(match.date)}>
            Barevni {match.score_a} : {match.score_b} Zeleni
        </AwardRow>
    );
}

function PlayerMatchAward({ title, record, players, format }: {
    title: string;
    record: PlayerMatchRecord | null;
    players: Player[];
    format: (value: number) => string;
}) {
    if (!record || record.entries.length > MAX_TIED_WINNERS) return null;
    return (
        <AwardRow title={title} value={format(record.value)}>
            {record.entries.map(({ playerId, match }, i) => (
                <span key={`${playerId}-${match.id}`}>
                    {i > 0 && ", "}
                    <PlayerLinks ids={[playerId]} players={players} />
                    <span className="text-xs text-gray-500"> ({formatDate(match.date)})</span>
                </span>
            ))}
        </AwardRow>
    );
}

const plural = (n: number, word: string, pluralWord = `${word}s`) => `${n} ${n === 1 ? word : pluralWord}`;

function SeasonSummaryContent() {
    const { players, matches, loading } = usePlayerMatchData();
    const summary = useMemo(() => computeSeasonSummary(matches, players), [matches, players]);

    if (loading) return <div className="text-center">Loading...</div>

    if (!matches.length) {
        return <p className="text-center text-gray-500">No matches played in this season yet.</p>
    }

    const { overview, matchRecords, awards, funAwards } = summary;

    return (
        <>
            <p className="text-center text-sm text-gray-500 mb-6">
                {formatDate(overview.firstDate!)} – {formatDate(overview.lastDate!)}
            </p>

            <h2 className="text-xl font-semibold mb-4">📊 Season in Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <StatCard emoji="🏟️" title="Matches" value={overview.matchesPlayed} />
                <StatCard emoji="⚽" title="Goals" value={overview.totalGoals}
                          subtitle={`${overview.avgGoalsPerMatch.toFixed(1)} per match`} />
                {overview.totalAssists > 0 && <StatCard emoji="🎯" title="Assists" value={overview.totalAssists} />}
                <StatCard emoji="👥" title="Players" value={overview.playersUsed} subtitle="played at least once" />
                <StatCard emoji="🤏" title="One-goal games" value={overview.oneGoalGames}
                          subtitle={`${Math.round(overview.oneGoalGames / overview.matchesPlayed * 100)}% of matches`} />
                <StatCard emoji="🎩" title="Hat-tricks" value={overview.totalHatTricks} />
            </div>

            <h2 className="text-xl font-semibold mb-4">🎨 Barevni vs 🟢 Zeleni</h2>
            <div className="grid grid-cols-3 gap-4 mb-10">
                <StatCard title="Barevni wins" value={overview.teamAWins} />
                <StatCard title="Draws" value={overview.draws} />
                <StatCard title="Zeleni wins" value={overview.teamBWins} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">🏆 Awards</h2>
                    <ul>
                        <PlayerAward title="🐐 MVP of the Season" record={awards.mvp} players={players}
                                     format={(v) => `${v.toFixed(1)} pts`} />
                        <PlayerAward title="🥅 Golden Boot" record={awards.goldenBoot} players={players}
                                     format={(v) => `${plural(v, 'goal')} (${Math.round(awards.goldenBootShare * 100)}% of all)`} />
                        <PlayerAward title="🎯 Playmaker" record={awards.playmaker} players={players}
                                     format={(v) => plural(v, 'assist')} />
                        <PlayerAward title="🍁 Canadian Points King" record={awards.canadianPoints} players={players}
                                     format={(v) => `${v} pts`} />
                        <PlayerAward title="🦾 Iron Man" record={awards.ironMan} players={players}
                                     format={(v) => `${v} of ${overview.matchesPlayed} matches`} />
                        <PlayerAward title={`📈 Best Win Ratio (${MIN_MATCHES_FOR_RATIOS}+ matches)`} record={awards.bestWinRatio}
                                     players={players} format={(v) => `${(v * 100).toFixed(1)}%`} />
                        <PlayerAward title="🎩 Hat-trick King" record={awards.hatTrickKing} players={players}
                                     format={(v) => plural(v, 'hat-trick')} />
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">📅 Match Records</h2>
                    <ul>
                        <MatchAward title="🎆 Highest-scoring match" record={matchRecords.highestScoring}
                                    format={(v) => plural(v, 'goal')} />
                        <MatchAward title="💥 Biggest win" record={matchRecords.biggestMargin}
                                    format={(v) => `by ${plural(v, 'goal')}`} />
                        <MatchAward title="🧱 Lowest-scoring match" record={matchRecords.lowestScoring}
                                    format={(v) => plural(v, 'goal')} />
                        <PlayerMatchAward title="⚽ Most goals in one match" record={matchRecords.mostGoalsByPlayer}
                                          players={players} format={(v) => plural(v, 'goal')} />
                        <PlayerMatchAward title="🎯 Most assists in one match" record={matchRecords.mostAssistsByPlayer}
                                          players={players} format={(v) => plural(v, 'assist')} />
                        <PlayerMatchAward title="🚀 Best single-match performance" record={matchRecords.mostInvolvementsByPlayer}
                                          players={players} format={(v) => `${v} G+A`} />
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">🎭 Fun Awards</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                        <PlayerAward title="🔥 Longest win streak" record={funAwards.longestWinStreak} players={players}
                                     format={(v) => plural(v, 'win')} />
                        <PlayerAward title="🔥 Longest scoring streak" record={funAwards.longestScoringStreak} players={players}
                                     format={(v) => plural(v, 'match', 'matches')} />
                        <PlayerAward title="💀 Longest losing streak" record={funAwards.longestLosingStreak} players={players}
                                     format={(v) => plural(v, 'loss', 'losses')} />
                        <PlayerAward title="🥶 Longest goal drought" record={funAwards.longestDrought} players={players}
                                     format={(v) => plural(v, 'match', 'matches')} />
                        {funAwards.dynamicDuo && funAwards.dynamicDuo.pairs.length <= MAX_TIED_WINNERS && (
                            <AwardRow title="🤝 Dynamic Duo (most wins together)" value={plural(funAwards.dynamicDuo.value, 'win')}>
                                {funAwards.dynamicDuo.pairs.map((pair, i) => (
                                    <span key={pair.join('|')}>
                                        {i > 0 && " · "}
                                        <PlayerLinks ids={[pair[0]]} players={players} /> &{" "}
                                        <PlayerLinks ids={[pair[1]]} players={players} />
                                    </span>
                                ))}
                            </AwardRow>
                        )}
                        <PlayerAward title="😤 Hero in Defeat (goals in lost matches)" record={funAwards.heroInDefeat}
                                     players={players} format={(v) => plural(v, 'goal')} />
                        <PlayerAward title="🤷 Mr. Draw" record={funAwards.mrDraw} players={players}
                                     format={(v) => plural(v, 'draw')} />
                    </ul>
                </div>
            </div>
        </>
    );
}

export default function SummaryPage() {
    const { seasonId, seasons } = useSeason();

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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">🏁 Season Summary - {getSeasonName(seasons, seasonId)}</h1>
            {STATS_HIDDEN ? (
                <p className="text-center text-gray-500 mt-6">🤫 Season summary unlocks after the last match of the season</p>
            ) : (
                <SeasonSummaryContent />
            )}
            <div className="text-center mt-10">
                <Link href={"/"}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    ⬅️ Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
