'use client'

import { Player } from "@/app/types";
import {getPlayerName, getTrophy} from "@/app/utils/playerHelpers";

type Props = {
    id: string;
    players: Player[];
    index: number;
};

export default function CustomBadgeForPlayer({ id, players, index }: Props) {
    const playerName = getPlayerName(players, id);
    const trophy = getTrophy(index);
    const matoId = "653c6fe7-2bb5-4ea5-8261-fb1aa6f6f6f0";

    return (
        <span>
            <span className="text-xl">{trophy}</span> {playerName}
            {id === matoId && (
                <span>
                🩼
                </span>
            )}
        </span>
    );
}