'use server'

import {revalidatePath, revalidateTag} from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { cookies } from "next/headers";
import * as webpush from 'web-push'
import { PushSubscription } from 'web-push'

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


let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
            'mailto:janrdch@gmail.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        )
    }
    subscription = sub
    // In a production environment, you would want to store the subscription in a database
    // For example: await db.subscriptions.create({ data: sub })
    return { success: true }
}

export async function unsubscribeUser() {
    subscription = null
    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return { success: true }
}

export async function sendNotification(message: string) {
    if (!subscription) {
        throw new Error('No subscription available')
    }

    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
            'mailto:janrdch@gmail.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        )
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'Test Notification',
                body: message,
                icon: '/icon.png',
            })
        )
        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
}