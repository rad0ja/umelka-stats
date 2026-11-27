'use client';

import {Match, Player} from "@/app/types";
import { getPlayerName } from "@/app/utils/playerHelpers";
import RecentFormBadge from "@/app/components/RecentFormBadge";
import { getRecentForm } from "@/app/utils/form-utils";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import Link from "next/link";
import { maskMatchCount } from "@/app/utils/statsMask";
import BoardPhoto from "@/app/components/BoardPhoto";

type Props = {
    match: Match;
    players: Player[];
};

export default function MatchSummary({ match, players }: Props) {
    const { matches } = usePlayerMatchData();
    const recentForm = getRecentForm(matches, players.map(p => p.id), 5);
    const matchday = matches.filter((m) => new Date(m.date).getTime() <= new Date(match.date).getTime()).length;

    const renderTeam = (team: string[], label: string) => (
        <div>
            <h3 className="font-display text-lg font-bold px-1 pb-1 border-b-2 border-pitch">{label}</h3>
            <ul>
                {team.map((playerId) => {
                    const goals = match.goals[playerId] || 0;
                    const assists = match.assists[playerId] || 0;
                    return (
                        <li key={playerId} className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 py-2 px-1 border-b border-line">
                            <div className="min-w-0">
                                <Link href={`/players/${playerId}`} className="font-medium hover:underline break-words">
                                    {getPlayerName(players, playerId)}
                                </Link>
                                {String(match.jersey_player_id) === String(playerId) && (
                                    <span className="ml-1" title="Jersey service: washes the jerseys and brings them to the next match">👕</span>
                                )}
                            </div>
                            <span className="flex gap-1.5 shrink-0 justify-end">
                                {goals > 0 && (
                                    <span className="num rounded-full bg-bib text-ink px-2 text-sm" title="Goals">⚽ {maskMatchCount(goals)}</span>
                                )}
                                {assists > 0 && (
                                    <span className="num rounded-full bg-surface-2 px-2 text-sm" title="Assists">🤝 {maskMatchCount(assists)}</span>
                                )}
                            </span>
                            <div className="col-span-2">
                                <RecentFormBadge form={recentForm[playerId] || []}/>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <section className="panel overflow-hidden mb-6">
            <div className="mowed relative text-white text-center px-4 pt-5 pb-6 overflow-hidden">
                <svg aria-hidden className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="200" cy="80" r="52" />
                    <line x1="200" y1="0" x2="200" y2="160" />
                    <circle cx="200" cy="80" r="3" fill="white" />
                </svg>
                <p className="relative font-display text-lg text-white/80">
                    Matchday {matchday} · {new Date(match.date).toLocaleDateString()}
                </p>
                <div className="relative grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-8 gap-y-1">
                    <span className="scoreboard-score order-first col-span-2 sm:col-span-1 sm:order-none sm:col-start-2 sm:row-start-1 font-display italic font-extrabold text-8xl leading-none tabular-nums">
                        {match.score_a}<span className="text-bib px-1">:</span>{match.score_b}
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-semibold text-center sm:text-right sm:col-start-1 sm:row-start-1">Team A</span>
                    <span className="font-display text-xl sm:text-2xl font-semibold text-center sm:text-left sm:col-start-3 sm:row-start-1">Team B</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4">
                {renderTeam(match.team_a, "Team A")}
                {renderTeam(match.team_b, "Team B")}
            </div>
            <div className="px-4 pb-4">
                <BoardPhoto key={match.id} match={match} />
            </div>
        </section>
    );
}
