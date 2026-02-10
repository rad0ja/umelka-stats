'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from "@/lib/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        // You can handle errors more gracefully here
        redirect('/login?error=Invalid credentials')
    }

    const cookieStore = await cookies()
    if (!cookieStore.get('seasonId')) {
        cookieStore.set('seasonId', '2')
    }

    // Check if user has a team and set cookie to skip middleware DB check
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: membership } = await supabase
            .from('team_members')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .single()

        if (membership) {
            cookieStore.set('hasTeam', 'true', { path: '/' })
        }
    }

    revalidatePath('/', 'layout')
    redirect('/stats')
}    