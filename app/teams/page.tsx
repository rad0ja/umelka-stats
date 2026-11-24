'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Match, Player, TeamSplit } from '@/app/types';
import { buildTeamModel, SUGGESTED_TEAMS_KEY } from '@/app/utils/teamSuggestion';
import { useSeason } from '@/app/context/SeasonContext';
import SeasonPicker from '@/app/components/SeasonPicker';
import RecentFormBadge from '@/app/components/RecentFormBadge';
import { STATS_HIDDEN } from '@/app/utils/statsMask';

const ATTENDING_KEY = 'teams.attending';
const MIN_PLAYERS = 4;

type SeasonMatch = Match & { season_id: number | null };

export default function TeamsPage() {
    const router = useRouter();
    const { seasonId } = useSeason();
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<SeasonMatch[]>([]);
    const [loading, setLoading] = useState(true);

    const [attending, setAttending] = useState<string[]>([]);
    const [attendingLoaded, setAttendingLoaded] = useState(false);
    const [search, setSearch] = useState('');

    const [options, setOptions] = useState<TeamSplit[]>([]);
    const [active, setActive] = useState(0);
    // The split being shown, after any manual moves
    const [teams, setTeams] = useState<{ teamA: string[]; teamB: string[] } | null>(null);
    // Players pinned to whichever team they're in when re-suggesting
    const [locks, setLocks] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            const [{ data: playersData }, { data: matchesData }] = await Promise.all([
                supabase.from('players').select('id, name').order('name'),
                supabase.from('matches').select('*'),
            ]);
            setPlayers(playersData ?? []);
            setMatches((matchesData ?? []) as SeasonMatch[]);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(ATTENDING_KEY) ?? '[]');
            if (Array.isArray(stored)) setAttending(stored);
        } catch { /* ignore a corrupted value */ }
        setAttendingLoaded(true);
    }, []);

    useEffect(() => {
        if (attendingLoaded) localStorage.setItem(ATTENDING_KEY, JSON.stringify(attending));
    }, [attending, attendingLoaded]);

    const seasonMatches = useMemo(
        () => (seasonId ? matches.filter((m) => String(m.season_id) === seasonId) : []),
        [matches, seasonId],
    );

    // Frequent players first, so the usual crowd is at the top of the list
    const sortedPlayers = useMemo(() => {
        const count = (list: Match[]) => {
            const c: Record<string, number> = {};
            list.forEach((m) => [...m.team_a, ...m.team_b].forEach((id) => (c[id] = (c[id] ?? 0) + 1)));
            return c;
        };
        const season = count(seasonMatches);
        const all = count(matches);
        return [...players].sort((a, b) =>
            (season[b.id] ?? 0) - (season[a.id] ?? 0) ||
            (all[b.id] ?? 0) - (all[a.id] ?? 0) ||
            a.name.localeCompare(b.name));
    }, [players, matches, seasonMatches]);

    // Ignore stored ids of players that no longer exist
    const attendingIds = useMemo(
        () => attending.filter((id) => players.some((p) => p.id === id)),
        [attending, players],
    );

    const model = useMemo(
        () => buildTeamModel(players, seasonMatches, matches, attendingIds),
        [players, seasonMatches, matches, attendingIds],
    );
    const ratingOf = useMemo(() => new Map(model.ratings.map((r) => [r.id, r])), [model]);
    const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? 'Unknown';

    // Changing who's coming invalidates any suggestion on screen
    useEffect(() => {
        setOptions([]);
        setTeams(null);
        setLocks([]);
    }, [attendingIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleAttending = (id: string) =>
        setAttending((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const runSuggest = (keepLocks: boolean) => {
        const pinned = keepLocks && teams ? locks : [];
        const lockedA = pinned.filter((id) => teams?.teamA.includes(id));
        const lockedB = pinned.filter((id) => teams?.teamB.includes(id));
        const result = model.suggest({ lockedA, lockedB, count: 3 });
        if (!keepLocks) setLocks([]);
        setOptions(result);
        setActive(0);
        setTeams(result[0] ? { teamA: result[0].teamA, teamB: result[0].teamB } : null);
    };

    const pickOption = (i: number) => {
        setActive(i);
        setTeams({ teamA: options[i].teamA, teamB: options[i].teamB });
    };

    const movePlayer = (id: string) => {
        if (!teams || locks.includes(id)) return;
        setTeams(teams.teamA.includes(id)
            ? { teamA: teams.teamA.filter((x) => x !== id), teamB: [...teams.teamB, id] }
            : { teamA: [...teams.teamA, id], teamB: teams.teamB.filter((x) => x !== id) });
    };

    const toggleLock = (id: string) =>
        setLocks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const current = teams ? model.scoreSplit(teams.teamA, teams.teamB) : null;
    const edited = !!teams && !!options[active] &&
        (teams.teamA.join() !== options[active].teamA.join() || teams.teamB.join() !== options[active].teamB.join());

    const applyTeams = () => {
        if (!teams) return;
        sessionStorage.setItem(SUGGESTED_TEAMS_KEY, JSON.stringify(teams));
        router.push('/add-match');
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    const q = search.trim().toLowerCase();
    const visiblePlayers = q ? sortedPlayers.filter((p) => p.name.toLowerCase().includes(q)) : sortedPlayers;

    const renderTeam = (side: 'A' | 'B') => {
        if (!teams || !current) return null;
        const ids = side === 'A' ? teams.teamA : teams.teamB;
        const accent = side === 'A' ? 'border-blue-500' : 'border-red-500';
        const chance = side === 'A' ? current.winChanceA : 1 - current.winChanceA;
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow border-t-4 ${accent} p-4`}>
                <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-lg font-bold">Team {side} <span className="text-sm font-normal text-gray-500">({ids.length})</span></h3>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(chance * 100)} %</span>
                </div>
                <ul className="space-y-1">
                    {ids.map((id) => {
                        const r = ratingOf.get(id);
                        const locked = locks.includes(id);
                        return (
                            <li key={id} className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleLock(id)}
                                    title={locked ? 'Unlock' : `Keep in Team ${side} when re-suggesting`}
                                    className={`w-7 text-center ${locked ? '' : 'opacity-30 hover:opacity-70'}`}
                                >
                                    {locked ? '🔒' : '🔓'}
                                </button>
                                <button
                                    onClick={() => movePlayer(id)}
                                    disabled={locked}
                                    title={locked ? 'Locked' : `Move to Team ${side === 'A' ? 'B' : 'A'}`}
                                    className="flex-1 flex items-center justify-between gap-2 text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:hover:bg-transparent"
                                >
                                    <span className="font-medium">{nameOf(id)}</span>
                                    {!STATS_HIDDEN && r && (
                                        <span className="flex items-center gap-2">
                                            <span className="hidden sm:inline"><RecentFormBadge form={r.form.slice(0, 3)} /></span>
                                            <span className="text-xs tabular-nums text-gray-500 w-8 text-right">{r.rating.toFixed(0)}</span>
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">⚖️ Suggest Teams</h1>
            <p className="text-center text-sm text-gray-500 mb-2">
                Tick who&apos;s coming to the next match, then let the stats split them into two even teams.
            </p>
            <SeasonPicker />

            {/* Step 1: attendance */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h2 className="text-lg font-semibold">1. Who&apos;s coming? <span className="text-gray-500 font-normal">({attendingIds.length})</span></h2>
                    <div className="flex gap-2 text-sm">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                            className="border rounded px-2 py-1 w-32 dark:bg-black"
                        />
                        <button onClick={() => setAttending([])} className="px-2 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700">
                            Clear
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {visiblePlayers.map((p) => {
                        const on = attendingIds.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => toggleAttending(p.id)}
                                aria-pressed={on}
                                className={`px-3 py-1 rounded-full text-sm border transition ${on
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-green-500'}`}
                            >
                                {on ? '✓ ' : ''}{p.name}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => runSuggest(false)}
                        disabled={attendingIds.length < MIN_PLAYERS}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        ⚖️ Suggest teams
                    </button>
                    {attendingIds.length < MIN_PLAYERS && (
                        <p className="text-xs text-gray-500 mt-1">Pick at least {MIN_PLAYERS} players.</p>
                    )}
                </div>
            </section>

            {/* Step 2: suggestions */}
            {teams && current && (
                <section>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h2 className="text-lg font-semibold">2. Suggested teams</h2>
                        <div className="flex gap-1">
                            {options.map((o, i) => (
                                <button
                                    key={i}
                                    onClick={() => pickOption(i)}
                                    className={`px-3 py-1 rounded text-sm ${i === active && !edited ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    Option {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-center mb-3">
                        Balance <b>{Math.round(current.winChanceA * 100)} % – {Math.round((1 - current.winChanceA) * 100)} %</b>
                        <span className="text-gray-500"> · strength gap {current.diff.toFixed(1)}</span>
                        {edited && <span className="text-orange-600"> · edited by hand</span>}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {renderTeam('A')}
                        {renderTeam('B')}
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Tap a player to move them to the other team. 🔒 keeps a player in their team when you re-suggest.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <button
                            onClick={() => runSuggest(true)}
                            className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            🔄 Re-suggest{locks.length ? ' with locks' : ''}
                        </button>
                        <button
                            onClick={applyTeams}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            ✅ Use these teams
                        </button>
                    </div>

                    <details className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                        <summary className="cursor-pointer">How are teams suggested?</summary>
                        <p className="mt-2">
                            Each player gets a rating from win rate (draw counts half), goals and assists per game, and
                            form over the last 5 matches. This season counts most; players with few matches this season
                            lean on their all-time numbers, and players with few matches overall are treated as average.
                            Pairs who keep winning together count a bit extra on the same team. Every possible split is
                            checked and the most even ones are shown. With an odd number of players the smaller team is
                            judged as if it had one average player more.
                        </p>
                    </details>
                </section>
            )}

            <div className="text-center mt-8">
                <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    ⬅ Back to dashboard
                </Link>
            </div>
        </div>
    );
}
