'use client'

import { PlayerLeaderboardItem } from './PlayerLeaderboardItem'

interface LeaderboardPlayer {
  id: string
  name: string
  position: string
  goals: number
  assists: number
  avatar: string
}

interface PlayerLeaderboardProps {
  players: LeaderboardPlayer[]
}

export function PlayerLeaderboard({ players }: PlayerLeaderboardProps) {
  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold mb-3 px-2 dark:text-white">Leaderboard</h2>
      <div className="space-y-3">
        {players.map((player, index) => (
          <PlayerLeaderboardItem
            key={player.id}
            player={player}
            rank={index + 1}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
