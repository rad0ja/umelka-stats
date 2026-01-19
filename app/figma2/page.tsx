import { getPlayerStatsForSeason } from '@/app/data/getPlayerStatsForSeason'
import { PlayerStats } from '@/app/components/figma/PlayerStats'
import { cookies } from 'next/headers'

export default async function StatsPage() {
  const seasonId = (await cookies()).get('seasonId')?.value
  
      const data = await getPlayerStatsForSeason(seasonId)
      if (!data) return null
  return <PlayerStats data={data} />
}