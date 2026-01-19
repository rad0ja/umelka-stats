// lib/get-matches.ts
import 'server-only'
import { createClient } from '@/lib/server'

export async function getMatchesForSeason(seasonId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('matches')
        .select('*')
        .eq('season_id', seasonId)

    return data ?? []
}
