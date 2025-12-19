'use server'

import {revalidatePath, revalidateTag} from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { cookies } from "next/headers";

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function setSeason(seasonId: string) {
    const cookieStore = await cookies()
    cookieStore.set('seasonId', seasonId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    })

    revalidateTag('matches')
}