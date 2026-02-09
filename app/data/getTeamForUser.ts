import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/server'

export const getTeamForUser = cache(async () => {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('team_members')
        .select('*, teams(*)')
        .eq('user_id', user.id)
        .limit(1)
        .single()

    return data
})
