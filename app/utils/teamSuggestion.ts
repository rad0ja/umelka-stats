// Team suggestions: rate the players attending the next match from their stats,
// then search the possible splits for the most balanced teams.
// Pure functions only, so it can be tested without React or Supabase.

import { Match, Player, PlayerRating, TeamSplit } from "@/app/types";
import { getRecentForm } from "@/app/utils/form-utils";
import { MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";

// How much each stat counts toward a player's rating (they sum to 1). Tune here.
export const RATING_WEIGHTS = {
    winScore: 0.35,
    goalsPerGame: 0.30,
    assistsPerGame: 0.15,
    formScore: 0.20,
};

// Matches of "evidence" a raw ratio needs before it outweighs the fallback value.
// Season numbers fall back to all-time, all-time numbers fall back to the group average.
const SHRINK = MIN_MATCHES_FOR_RATIOS;
const FORM_GAMES = 5;
const FORM_SHRINK = 2;

// Chemistry: two players who have won together more than their own records predict.
const CHEMISTRY_MIN_SHARED = 4;   // ignore pairs with fewer shared matches
const CHEMISTRY_WEIGHT = 16;      // rating points per pair winning 100 % more often than expected

// Above this many attendees the exhaustive search gets slow; use local search instead.
const EXHAUSTIVE_MAX_PLAYERS = 20;

type RawStats = { games: number; winPoints: number; goals: number; assists: number };

function collectStats(matches: Match[]): Record<string, RawStats> {
    const stats: Record<string, RawStats> = {};
    const get = (id: string) => (stats[id] ??= { games: 0, winPoints: 0, goals: 0, assists: 0 });

    for (const match of matches) {
        const draw = match.score_a === match.score_b;
        const aWon = match.score_a > match.score_b;
        for (const id of match.team_a) {
            const s = get(id);
            s.games++;
            s.winPoints += draw ? 0.5 : aWon ? 1 : 0;
        }
        for (const id of match.team_b) {
            const s = get(id);
            s.games++;
            s.winPoints += draw ? 0.5 : aWon ? 0 : 1;
        }
        for (const [id, n] of Object.entries(match.goals ?? {})) get(id).goals += n;
        for (const [id, n] of Object.entries(match.assists ?? {})) get(id).assists += n;
    }
    return stats;
}

// Weighted average of an observed ratio and a fallback, by number of observations.
const shrink = (observed: number, n: number, fallback: number, k: number) =>
    (observed * n + fallback * k) / (n + k);

function zScores(values: number[]): number[] {
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);
    return values.map((v) => (sd > 1e-9 ? (v - mean) / sd : 0));
}

export function ratePlayers(
    players: Player[],
    seasonMatches: Match[],
    allMatches: Match[],
    attendingIds: string[],
): PlayerRating[] {
    const season = collectStats(seasonMatches);
    const allTime = collectStats(allMatches);

    // Group averages across everyone who ever played: the prior for little-known players
    const totals = Object.values(allTime).reduce(
        (t, s) => ({ games: t.games + s.games, goals: t.goals + s.goals, assists: t.assists + s.assists }),
        { games: 0, goals: 0, assists: 0 },
    );
    const avgGoals = totals.games ? totals.goals / totals.games : 0;
    const avgAssists = totals.games ? totals.assists / totals.games : 0;

    const forms = getRecentForm(allMatches, attendingIds, FORM_GAMES);
    const byId = new Map(players.map((p) => [p.id, p]));

    const base = attendingIds
        .filter((id) => byId.has(id))
        .map((id) => {
            const s = season[id] ?? { games: 0, winPoints: 0, goals: 0, assists: 0 };
            const a = allTime[id] ?? { games: 0, winPoints: 0, goals: 0, assists: 0 };
            const ratio = (x: number, n: number) => (n ? x / n : 0);

            const blend = (seasonX: number, allX: number, prior: number) =>
                shrink(ratio(seasonX, s.games), s.games, shrink(ratio(allX, a.games), a.games, prior, SHRINK), SHRINK);

            const form = forms[id] ?? [];
            const formPoints = form.reduce((sum, r) => sum + (r === 'W' ? 1 : r === 'D' ? 0.5 : 0), 0);

            return {
                id,
                name: byId.get(id)!.name,
                seasonMatches: s.games,
                allTimeMatches: a.games,
                winScore: blend(s.winPoints, a.winPoints, 0.5),
                goalsPerGame: blend(s.goals, a.goals, avgGoals),
                assistsPerGame: blend(s.assists, a.assists, avgAssists),
                form,
                formScore: shrink(ratio(formPoints, form.length), form.length, 0.5, FORM_SHRINK),
            };
        });

    if (base.length === 0) return [];

    const keys = Object.keys(RATING_WEIGHTS) as (keyof typeof RATING_WEIGHTS)[];
    const z = Object.fromEntries(keys.map((k) => [k, zScores(base.map((p) => p[k]))])) as Record<typeof keys[number], number[]>;

    return base.map((p, i) => ({
        ...p,
        rating: 50 + 10 * keys.reduce((sum, k) => sum + RATING_WEIGHTS[k] * z[k][i], 0),
    }));
}

// ---------------------------------------------------------------------------
// Split search

export type TeamModel = {
    ratings: PlayerRating[];
    scoreSplit: (teamA: string[], teamB: string[]) => TeamSplit;
    suggest: (opts?: { lockedA?: string[]; lockedB?: string[]; count?: number }) => TeamSplit[];
};

// Extra strength of each attending pair when on the same team, from their shared history.
function pairChemistry(ids: string[], ratings: PlayerRating[], allMatches: Match[]): number[][] {
    const n = ids.length;
    const index = new Map(ids.map((id, i) => [id, i]));
    const shared = Array.from({ length: n }, () => new Array(n).fill(0));
    const points = Array.from({ length: n }, () => new Array(n).fill(0));

    for (const match of allMatches) {
        const draw = match.score_a === match.score_b;
        const aWon = match.score_a > match.score_b;
        for (const [team, won] of [[match.team_a, aWon], [match.team_b, !aWon]] as const) {
            const present = team.map((id) => index.get(id)).filter((i): i is number => i !== undefined);
            const pts = draw ? 0.5 : won ? 1 : 0;
            for (let x = 0; x < present.length; x++) {
                for (let y = x + 1; y < present.length; y++) {
                    const [i, j] = [present[x], present[y]];
                    shared[i][j]++; shared[j][i]++;
                    points[i][j] += pts; points[j][i] += pts;
                }
            }
        }
    }

    const chem = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const k = shared[i][j];
            if (k < CHEMISTRY_MIN_SHARED) continue;
            const expected = (ratings[i].winScore + ratings[j].winScore) / 2;
            const together = shrink(points[i][j] / k, k, expected, SHRINK);
            chem[i][j] = chem[j][i] = CHEMISTRY_WEIGHT * (together - expected);
        }
    }
    return chem;
}

export function buildTeamModel(
    players: Player[],
    seasonMatches: Match[],
    allMatches: Match[],
    attendingIds: string[],
): TeamModel {
    const ratings = ratePlayers(players, seasonMatches, allMatches, attendingIds);
    const ids = ratings.map((r) => r.id);
    const n = ids.length;
    const index = new Map(ids.map((id, i) => [id, i]));
    const value = ratings.map((r) => r.rating);
    const chem = pairChemistry(ids, ratings, allMatches);
    const avgRating = n ? value.reduce((s, v) => s + v, 0) / n : 0;

    // Strength of a team given as indices. A team with one player fewer gets an average
    // player's rating on top, so 5 v 6 is judged as "is the 5 as good as the 6 minus one".
    const strength = (team: number[], otherSize: number) => {
        let s = 0;
        for (let x = 0; x < team.length; x++) {
            s += value[team[x]];
            for (let y = x + 1; y < team.length; y++) s += chem[team[x]][team[y]];
        }
        return s + Math.max(0, otherSize - team.length) * avgRating;
    };

    const toSplit = (a: number[], b: number[]): TeamSplit => {
        const strengthA = strength(a, b.length);
        const strengthB = strength(b, a.length);
        return {
            teamA: a.map((i) => ids[i]),
            teamB: b.map((i) => ids[i]),
            strengthA,
            strengthB,
            diff: Math.abs(strengthA - strengthB),
            // ~10 rating points (one std. dev. of a single player) ≈ 66 % / 34 %
            winChanceA: 1 / (1 + Math.exp(-(strengthA - strengthB) / 15)),
        };
    };

    const scoreSplit = (teamA: string[], teamB: string[]) =>
        toSplit(
            teamA.map((id) => index.get(id)).filter((i): i is number => i !== undefined),
            teamB.map((id) => index.get(id)).filter((i): i is number => i !== undefined),
        );

    const suggest: TeamModel['suggest'] = ({ lockedA = [], lockedB = [], count = 3 } = {}) => {
        if (n < 2) return [];
        const lockA = new Set(lockedA.map((id) => index.get(id)).filter((i) => i !== undefined));
        const lockB = new Set(lockedB.map((id) => index.get(id)).filter((i) => i !== undefined));
        const noLocks = lockA.size === 0 && lockB.size === 0;
        // Team A takes the smaller half; with locks either half could be the smaller one.
        const sizes = n % 2 === 0 || noLocks ? [Math.floor(n / 2)] : [Math.floor(n / 2), Math.ceil(n / 2)];

        // Keep a pool of the best candidates, then pick distinct ones from it
        let pool: { cost: number; inA: boolean[] }[] = [];
        let worst = Infinity;
        const consider = (inA: boolean[]) => {
            const a: number[] = [], b: number[] = [];
            inA.forEach((v, i) => (v ? a : b).push(i));
            const s = toSplit(a, b);
            if (pool.length >= 300 && s.diff >= worst) return;
            pool.push({ cost: s.diff, inA: inA.slice() });
            if (pool.length > 600) {
                pool.sort((x, y) => x.cost - y.cost);
                pool = pool.slice(0, 300);
                worst = pool[pool.length - 1].cost;
            }
        };

        const allowed = (i: number, toA: boolean) => (toA ? !lockB.has(i) : !lockA.has(i));

        if (n <= EXHAUSTIVE_MAX_PLAYERS) {
            const inA = new Array(n).fill(false);
            for (const sizeA of sizes) {
                // Without locks, swapping A and B gives the same split: pin player 0 to A (even n only;
                // with odd n the sizes differ so there is no mirror).
                const pinFirst = noLocks && n % 2 === 0;
                const dfs = (i: number, left: number) => {
                    if (left > n - i) return;
                    if (i === n) { if (left === 0) consider(inA); return; }
                    if (left > 0 && allowed(i, true)) {
                        inA[i] = true; dfs(i + 1, left - 1); inA[i] = false;
                    }
                    if (!(pinFirst && i === 0) && allowed(i, false)) dfs(i + 1, left);
                };
                dfs(0, sizeA);
            }
        } else {
            // Local search: random valid start, then best pairwise swap until nothing improves
            const free = ids.map((_, i) => i).filter((i) => !lockA.has(i) && !lockB.has(i));
            const costOf = (inA: boolean[]) => {
                const a: number[] = [], b: number[] = [];
                inA.forEach((v, i) => (v ? a : b).push(i));
                return toSplit(a, b).diff;
            };
            for (let restart = 0; restart < 150; restart++) {
                const sizeA = sizes[restart % sizes.length];
                const shuffled = [...free].sort(() => Math.random() - 0.5);
                const inA = new Array(n).fill(false);
                lockA.forEach((i) => (inA[i as number] = true));
                shuffled.slice(0, Math.max(0, sizeA - lockA.size)).forEach((i) => (inA[i] = true));
                let cost = costOf(inA);
                for (let improved = true; improved;) {
                    improved = false;
                    for (const x of free) for (const y of free) {
                        if (!inA[x] || inA[y]) continue;
                        inA[x] = false; inA[y] = true;
                        const c = costOf(inA);
                        if (c < cost - 1e-9) { cost = c; improved = true; }
                        else { inA[x] = true; inA[y] = false; }
                    }
                }
                consider(inA);
            }
        }

        pool.sort((x, y) => x.cost - y.cost);
        // Options must differ by at least two swaps (one swap for small groups) to be worth showing
        const minMoved = n >= 8 ? 4 : 2;
        const moved = (p: boolean[], q: boolean[]) => {
            let same = 0, flipped = 0;
            p.forEach((v, i) => (v === q[i] ? same++ : flipped++));
            return n % 2 === 0 && noLocks ? Math.min(same, flipped) : flipped;
        };
        const picked: boolean[][] = [];
        // Don't pad the list with clearly lopsided splits (happens with very few players)
        const maxCost = (pool[0]?.cost ?? 0) + 10;
        for (const c of pool) {
            if (picked.length >= count || c.cost > maxCost) break;
            if (picked.every((p) => moved(p, c.inA) >= minMoved)) picked.push(c.inA);
        }
        return picked.map((inA) => {
            const a: number[] = [], b: number[] = [];
            inA.forEach((v, i) => (v ? a : b).push(i));
            // Strongest player first within each team for a stable, readable order
            const byRating = (x: number, y: number) => value[y] - value[x];
            return toSplit(a.sort(byRating), b.sort(byRating));
        });
    };

    return { ratings, scoreSplit, suggest };
}

// sessionStorage key: /teams writes the chosen split, /add-match pre-fills the live match setup with it
export const SUGGESTED_TEAMS_KEY = 'suggestedTeams';
