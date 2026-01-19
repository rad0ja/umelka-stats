import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/server'

export const getAllPlayers = cache(async () => {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('players')
        .select('*')

    return data
})
