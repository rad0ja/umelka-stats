import { cookies } from 'next/headers';
import { getPlayerStatsForSeason } from '@/app/data/getPlayerStatsForSeason';
import { PlayerStats } from '@/app/components/figma/PlayerStats';

export default async function StatsPage() {
  const seasonId = (await cookies()).get('seasonId')?.value;
  const data = seasonId ? await getPlayerStatsForSeason(seasonId) : null;

  return <PlayerStats data={data} />;
}
