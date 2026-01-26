import { Tables } from '@/app/types/database.types'

export type Player = Tables<'players'>

export interface PlayerStats {
  goals: number
  wins: number
  matchesPlayed: number
  draws: number
  winRatio: string | number
  goalsPerGame: string | number
}

export interface PlayerStatsData {
  player: Player
  stats: PlayerStats
  goalTarget: number
}

export interface StatCardProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>
  label: string
  value: string
  variant: 'win' | 'goal'
}

export interface TopScorerCardProps {
  name: string
  goals: number
  avatar: string
}

export interface PlayerLeaderboardItemProps {
  player: {
    id: string
    name: string
    position: string
    goals: number
    assists: number
    avatar: string
  }
  rank: number
  index: number
}
