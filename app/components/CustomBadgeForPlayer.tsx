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
    const playerIds = ["653c6fe7-2bb5-4ea5-8261-fb1aa6f6f6f0", "56d7386b-39d2-4a14-ade4-83138a7b5c3b"];

    return (
        <span>
            <span className="text-xl">{trophy}</span> {playerName}
            {playerIds.includes(id) && (
                <span>
                🙂
                </span>
            )}
        </span>
    );
}