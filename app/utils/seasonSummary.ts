import { Player } from "@/app/types";
import { getAllMVPs } from "@/app/utils/getAllMVPs";
import { playerMatchHistory } from "@/app/utils/playerMatchHistory";
import { playerStreaks } from "@/app/utils/playerStreaks";
import { getQualifiedPlayerIds } from "@/app/utils/playerHelpers";

type Match = {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: Record<string, number>;
    assists: Record<string, number>;
    comments?: string | null;
};

// A record every tied player shares (e.g. two players with 12 goals both get the Golden Boot)
export type PlayerRecord = {
    playerIds: string[];
    value: number;
};

export type MatchRecord = {
    match: Match;
    value: number;
};

export type PlayerMatchRecord = {
    entries: { playerId: string; match: Match }[];
    value: number;
};

// Players tied for the highest value; null when nobody has more than 0
function topPlayers(record: Record<string, number>): PlayerRecord | null {
    const values = Object.values(record);
    if (!values.length) return null;
    const value = Math.max(...values);
    if (value <= 0) return null;
    return {
        playerIds: Object.keys(record).filter((id) => record[id] === value),
        value,
    };
}

// First match with the highest (or lowest) value, earliest date wins a tie
function pickMatch(matches: Match[], getValue: (m: Match) => number, lowest = false): MatchRecord | null {
    let best: MatchRecord | null = null;
    for (const match of matches) {
        const value = getValue(match);
        if (!best || (lowest ? value < best.value : value > best.value)) best = { match, value };
    }
    return best;
}

// Highest single-match value for one player, e.g. most goals in one game
function bestSingleMatch(matches: Match[], getValue: (m: Match, playerId: string) => number): PlayerMatchRecord | null {
    let value = 0;
    let entries: { playerId: string; match: Match }[] = [];
    for (const match of matches) {
        for (const playerId of [...match.team_a, ...match.team_b]) {
            const v = getValue(match, playerId);
            if (v > value) {
                value = v;
                entries = [{ playerId, match }];
            } else if (v === value && v > 0) {
                entries.push({ playerId, match });
            }
        }
    }
    return value > 0 ? { entries, value } : null;
}

const increment = (record: Record<string, number>, id: string, by = 1) => {
    record[id] = (record[id] || 0) + by;
};

export function computeSeasonSummary(matches: Match[], players: Player[]) {
    const sorted = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const goals: Record<string, number> = {};
    const assists: Record<string, number> = {};
    const appearances: Record<string, number> = {};
    const wins: Record<string, number> = {};
    const draws: Record<string, number> = {};
    const hatTricks: Record<string, number> = {};
    const goalsInDefeat: Record<string, number> = {};
    const duoWins: Record<string, number> = {};

    let totalGoals = 0;
    let totalAssists = 0;
    let teamAWins = 0;
    let teamBWins = 0;
    let drawCount = 0;
    let oneGoalGames = 0;

    for (const match of sorted) {
        totalGoals += match.score_a + match.score_b;
        totalAssists += Object.values(match.assists || {}).reduce((sum, n) => sum + n, 0);

        if (match.score_a > match.score_b) teamAWins++;
        else if (match.score_b > match.score_a) teamBWins++;
        else drawCount++;
        if (Math.abs(match.score_a - match.score_b) === 1) oneGoalGames++;

        for (const [playerId, count] of Object.entries(match.goals || {})) {
            increment(goals, playerId, count);
            if (count >= 3) increment(hatTricks, playerId);
        }
        for (const [playerId, count] of Object.entries(match.assists || {})) {
            increment(assists, playerId, count);
        }

        const sides = [
            { team: match.team_a, own: match.score_a, opp: match.score_b },
            { team: match.team_b, own: match.score_b, opp: match.score_a },
        ];
        for (const { team, own, opp } of sides) {
            for (const playerId of team) {
                increment(appearances, playerId);
                if (own > opp) increment(wins, playerId);
                else if (own === opp) increment(draws, playerId);
                else increment(goalsInDefeat, playerId, match.goals?.[playerId] || 0);
            }

            if (own > opp) {
                // Every pair of teammates on the winning side, key sorted so A|B === B|A
                for (let i = 0; i < team.length; i++) {
                    for (let j = i + 1; j < team.length; j++) {
                        increment(duoWins, [team[i], team[j]].sort().join("|"));
                    }
                }
            }
        }
    }

    const canadianPoints: Record<string, number> = {};
    for (const id of Object.keys(appearances)) {
        canadianPoints[id] = (goals[id] || 0) + (assists[id] || 0);
    }

    const winRatios: Record<string, number> = {};
    for (const id of getQualifiedPlayerIds(appearances)) {
        winRatios[id] = (wins[id] || 0) / appearances[id];
    }

    // Streaks use the same helpers as the player page, so the numbers match
    const history = playerMatchHistory(sorted);
    const winStreaks: Record<string, number> = {};
    const lossStreaks: Record<string, number> = {};
    const scoringStreaks: Record<string, number> = {};
    const droughts: Record<string, number> = {};
    for (const [playerId, { matches: playerMatches }] of Object.entries(history)) {
        const streaks = playerStreaks(playerMatches);
        winStreaks[playerId] = streaks.longestWinningStreak;
        lossStreaks[playerId] = streaks.longestLosingStreak;
        scoringStreaks[playerId] = streaks.longestScoringStreak;
        droughts[playerId] = streaks.longestNonScoringStreak;
    }

    const topDuo = topPlayers(duoWins);
    const duos = topDuo
        ? { pairs: topDuo.playerIds.map((key) => key.split("|")), value: topDuo.value }
        : null;

    const mvps = getAllMVPs(players, sorted).filter((p) => p.mvpScore > 0);
    const topMvp = mvps.length ? Math.max(...mvps.map((p) => p.mvpScore)) : 0;
    const mvp = mvps.length
        ? { playerIds: mvps.filter((p) => p.mvpScore === topMvp).map((p) => p.id), value: topMvp }
        : null;

    const goldenBoot = topPlayers(goals);

    return {
        overview: {
            matchesPlayed: sorted.length,
            totalGoals,
            totalAssists,
            avgGoalsPerMatch: sorted.length ? totalGoals / sorted.length : 0,
            playersUsed: Object.keys(appearances).length,
            firstDate: sorted[0]?.date ?? null,
            lastDate: sorted[sorted.length - 1]?.date ?? null,
            teamAWins,
            teamBWins,
            draws: drawCount,
            oneGoalGames,
            totalHatTricks: Object.values(hatTricks).reduce((sum, n) => sum + n, 0),
        },
        matchRecords: {
            highestScoring: pickMatch(sorted, (m) => m.score_a + m.score_b),
            biggestMargin: pickMatch(sorted, (m) => Math.abs(m.score_a - m.score_b)),
            lowestScoring: pickMatch(sorted, (m) => m.score_a + m.score_b, true),
            mostGoalsByPlayer: bestSingleMatch(sorted, (m, id) => m.goals?.[id] || 0),
            mostAssistsByPlayer: bestSingleMatch(sorted, (m, id) => m.assists?.[id] || 0),
            mostInvolvementsByPlayer: bestSingleMatch(sorted, (m, id) => (m.goals?.[id] || 0) + (m.assists?.[id] || 0)),
        },
        awards: {
            mvp,
            goldenBoot,
            goldenBootShare: goldenBoot && totalGoals ? goldenBoot.value / totalGoals : 0,
            playmaker: topPlayers(assists),
            canadianPoints: topPlayers(canadianPoints),
            ironMan: topPlayers(appearances),
            bestWinRatio: topPlayers(winRatios),
            hatTrickKing: topPlayers(hatTricks),
        },
        funAwards: {
            longestWinStreak: topPlayers(winStreaks),
            longestScoringStreak: topPlayers(scoringStreaks),
            longestLosingStreak: topPlayers(lossStreaks),
            longestDrought: topPlayers(droughts),
            dynamicDuo: duos,
            heroInDefeat: topPlayers(goalsInDefeat),
            mrDraw: topPlayers(draws),
        },
    };
}

export type SeasonSummary = ReturnType<typeof computeSeasonSummary>;
