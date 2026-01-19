import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/server'

export const getPlayerForUser = cache(async () => {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return data
})
