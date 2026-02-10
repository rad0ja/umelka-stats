'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/server'

function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

export async function createTeam(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const teamName = (formData.get('teamName') as string)?.trim()
    if (!teamName) {
        redirect('/onboarding?error=Team name is required')
    }

    // Generate invite code with collision retry
    let teamId: string | null = null
    for (let attempt = 0; attempt < 5; attempt++) {
        const inviteCode = generateInviteCode()

        const { data, error } = await supabase
            .from('teams')
            .insert({
                name: teamName,
                invite_code: inviteCode,
                created_by: user.id,
            })
            .select('id')
            .single()

        if (!error && data) {
            teamId = data.id
            break
        }
    }

    if (!teamId) {
        redirect('/onboarding?error=Could not create team, please try again')
    }

    // Add user as owner
    await supabase.from('team_members').insert({
        team_id: teamId,
        user_id: user.id,
        role: 'owner',
    })

    // Link player to team
    await supabase
        .from('players')
        .update({ team_id: teamId })
        .eq('user_id', user.id)

    const cookieStore = await cookies()
    cookieStore.set('hasTeam', 'true', { path: '/' })

    revalidatePath('/', 'layout')
    redirect('/stats')
}

export async function joinTeam(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const inviteCode = (formData.get('inviteCode') as string)?.toUpperCase().trim()
    if (!inviteCode) {
        redirect('/onboarding?error=Invite code is required')
    }

    // Look up team by invite code
    const { data: team } = await supabase
        .from('teams')
        .select('id, name')
        .eq('invite_code', inviteCode)
        .single()

    if (!team) {
        redirect('/onboarding?error=Invalid invite code')
    }

    // Add user as member
    const { error } = await supabase.from('team_members').insert({
        team_id: team.id,
        user_id: user.id,
        role: 'member',
    })

    if (error) {
        if (error.code === '23505') {
            redirect('/onboarding?error=You are already a member of this team')
        }
        redirect('/onboarding?error=Could not join team')
    }

    // Link player to team
    await supabase
        .from('players')
        .update({ team_id: team.id })
        .eq('user_id', user.id)

    const cookieStore = await cookies()
    cookieStore.set('hasTeam', 'true', { path: '/' })

    revalidatePath('/', 'layout')
    redirect('/stats')
}
