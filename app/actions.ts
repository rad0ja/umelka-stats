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

// Helper: send FCM notifications via the send-notification edge function
async function sendFcmNotification(
    accessToken: string,
    userIds: string[],
    title: string,
    body: string,
    data?: { type?: string; url?: string; eventId?: string }
) {
    if (userIds.length === 0) return

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ user_ids: userIds, title, body, data }),
            }
        )

        if (!res.ok) {
            const errText = await res.text()
            console.error('[sendFcmNotification] Edge function error:', res.status, errText)
        }
    } catch (err) {
        console.error('[sendFcmNotification] Fetch error:', err)
    }
}

// Send chat message and trigger FCM notifications
export async function sendChatMessage(content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Get sender's player name
    const { data: player } = await supabase
        .from('players')
        .select('name')
        .eq('user_id', user.id)
        .single()

    const senderName = player?.name || 'Someone'

    // Insert the message
    const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
            user_id: user.id,
            content: content.trim()
        })
        .select()
        .single()

    if (error) {
        console.error('[sendChatMessage] Error sending message:', error)
        return { success: false, error: 'Failed to send message' }
    }

    // Send FCM notifications to all other players
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
        // Get all player user_ids except the sender
        const { data: allPlayers } = await supabase
            .from('players')
            .select('user_id')
            .neq('user_id', user.id)
            .not('user_id', 'is', null)

        const recipientIds = (allPlayers || [])
            .map(p => p.user_id)
            .filter(Boolean) as string[]

        const truncatedMessage = content.length > 100
            ? content.substring(0, 100) + '...'
            : content

        await sendFcmNotification(
            session.access_token,
            recipientIds,
            senderName,
            truncatedMessage,
            { type: 'chat', url: '/chat' }
        )
    }

    return { success: true, message }
}

// Send event chat message and trigger FCM notifications
export async function sendEventChatMessage(eventId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Get sender's player name
    const { data: player } = await supabase
        .from('players')
        .select('name')
        .eq('user_id', user.id)
        .single()

    const senderName = player?.name || 'Someone'

    // Get event title for notification context
    const { data: event } = await supabase
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single()

    const eventTitle = event?.title || 'Event'

    // Insert the message
    const { data: message, error } = await supabase
        .from('event_chat_messages')
        .insert({
            event_id: eventId,
            user_id: user.id,
            content: content.trim()
        })
        .select()
        .single()

    if (error) {
        console.error('[sendEventChatMessage] Error sending message:', error)
        return { success: false, error: 'Failed to send message' }
    }

    // Send FCM notifications to event participants (excluding sender)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
        const { data: participants } = await supabase
            .from('event_participants')
            .select('user_id')
            .eq('event_id', eventId)
            .neq('user_id', user.id)
            .in('status', ['yes', 'tentative', 'queued'])

        const recipientIds = (participants || [])
            .map(p => p.user_id)
            .filter(Boolean) as string[]

        const truncatedMessage = content.length > 100
            ? content.substring(0, 100) + '...'
            : content

        await sendFcmNotification(
            session.access_token,
            recipientIds,
            `${senderName} in ${eventTitle}`,
            truncatedMessage,
            { type: 'event_chat', eventId, url: `/event/${eventId}` }
        )
    }

    return { success: true, message }
}
