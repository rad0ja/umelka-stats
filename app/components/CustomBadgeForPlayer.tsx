'use client'

import { Player } from "@/app/types";
import { getPlayerName, getTrophy } from "@/app/utils/playerHelpers";

type Props = {
    id: string;
    players: Player[];
    index: number;
};

export default function CustomBadgeForPlayer({ id, players, index }: Props) {
    const playerName = getPlayerName(players, id);
    const trophy = getTrophy(index);
    const playerIds: string[] = [];

    return (
        <span>
            <span className="text-xl">{trophy}</span> {playerName}
            {playerIds.length > 0 && playerIds.includes(id) && (
                <span>
                🙂
                </span>
            )}
        </span>
    );
}