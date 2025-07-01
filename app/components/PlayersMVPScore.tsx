import { calculatePlayerMVPScore } from "@/app/utils/playerHelpers";
import { PlayerStat } from "@/app/types";

type Props = {
    players: PlayerStat[];
}
export default function PlayersMVPScore({ players}: Props) {
    const scoredPlayers = calculatePlayerMVPScore(players);

    return (
        <div>
            {scoredPlayers.map(player => (
                <div key={player.id}>
                    {player.name} - Score: {player.score}
                </div>
            ))}
        </div>
    );
}
