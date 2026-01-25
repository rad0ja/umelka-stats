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

function initVapid() {
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
            'mailto:janrdch@gmail.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        )
    }
}

export async function subscribeUser(sub: PushSubscription) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Delete existing subscriptions for this user (one subscription per user)
    await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)

    // Store new subscription in database
    const { error } = await supabase
        .from('push_subscriptions')
        .insert({
            user_id: user.id,
            subscription: sub as unknown as Record<string, unknown>
        })

    if (error) {
        console.error('Error saving subscription:', error)
        return { success: false, error: 'Failed to save subscription' }
    }

    return { success: true }
}

export async function unsubscribeUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        console.error('Error removing subscription:', error)
        return { success: false, error: 'Failed to remove subscription' }
    }

    return { success: true }
}

export async function sendNotification(message: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    // Get user's subscription
    const { data: subData } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', user.id)
        .single()

    if (!subData?.subscription) {
        throw new Error('No subscription available')
    }

    initVapid()

    try {
        await webpush.sendNotification(
            subData.subscription as unknown as PushSubscription,
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

// Send push notification to all users except the sender
export async function sendChatNotification(senderUserId: string, senderName: string, messageContent: string) {
    const supabase = await createClient()

    // Get all subscriptions except the sender's
    const { data: subscriptions, error: fetchError } = await supabase
        .from('push_subscriptions')
        .select('subscription, user_id')
        .neq('user_id', senderUserId)

    console.log('[Chat Notification] Sender:', senderUserId)
    console.log('[Chat Notification] Found subscriptions:', subscriptions?.length ?? 0)
    if (fetchError) {
        console.error('[Chat Notification] Error fetching subscriptions:', fetchError)
    }

    if (!subscriptions || subscriptions.length === 0) {
        return { success: true, sent: 0 }
    }

    initVapid()

    const truncatedMessage = messageContent.length > 100
        ? messageContent.substring(0, 100) + '...'
        : messageContent

    const payload = JSON.stringify({
        title: `${senderName}`,
        body: truncatedMessage,
        icon: '/icon.png',
        data: {
            type: 'chat',
            url: '/figma'
        }
    })

    let sentCount = 0
    const failedUserIds: string[] = []

    await Promise.all(
        subscriptions.map(async ({ subscription, user_id }) => {
            try {
                console.log('[Chat Notification] Sending to user:', user_id)
                await webpush.sendNotification(
                    subscription as unknown as PushSubscription,
                    payload
                )
                sentCount++
                console.log('[Chat Notification] Successfully sent to user:', user_id)
            } catch (error: unknown) {
                console.error(`[Chat Notification] Failed to send to user ${user_id}:`, error)
                // If subscription is invalid (expired/unsubscribed), mark for cleanup
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode
                    if (statusCode === 404 || statusCode === 410) {
                        failedUserIds.push(user_id!)
                    }
                }
            }
        })
    )

    // Clean up invalid subscriptions
    if (failedUserIds.length > 0) {
        await supabase
            .from('push_subscriptions')
            .delete()
            .in('user_id', failedUserIds)
    }

    console.log('[Chat Notification] Total sent:', sentCount)
    return { success: true, sent: sentCount }
}

// Send chat message and trigger notifications
export async function sendChatMessage(content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    console.log('[sendChatMessage] User ID:', user.id)

    // Get sender's player name
    const { data: player } = await supabase
        .from('players')
        .select('name')
        .eq('user_id', user.id)
        .single()

    const senderName = player?.name || 'Someone'
    console.log('[sendChatMessage] Sender name:', senderName)

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

    console.log('[sendChatMessage] Message inserted, sending notifications...')

    // Send push notifications to other users
    try {
        const notifResult = await sendChatNotification(user.id, senderName, content)
        console.log('[sendChatMessage] Notification result:', notifResult)
    } catch (err) {
        console.error('[sendChatMessage] Error sending chat notifications:', err)
    }

    return { success: true, message }
}

// Send event chat message and trigger notifications
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

    // Send push notifications to event participants (excluding sender)
    try {
        await sendEventChatNotification(eventId, user.id, senderName, eventTitle, content)
    } catch (err) {
        console.error('[sendEventChatMessage] Error sending notifications:', err)
    }

    return { success: true, message }
}

// Send push notification to event participants
export async function sendEventChatNotification(
    eventId: string,
    senderUserId: string,
    senderName: string,
    eventTitle: string,
    messageContent: string
) {
    const supabase = await createClient()

    // Get participants of this event (excluding sender) with status yes or tentative
    const { data: participants } = await supabase
        .from('event_participants')
        .select('user_id')
        .eq('event_id', eventId)
        .neq('user_id', senderUserId)
        .in('status', ['yes', 'tentative', 'queued'])

    if (!participants || participants.length === 0) {
        return { success: true, sent: 0 }
    }

    const participantIds = participants.map(p => p.user_id).filter(Boolean) as string[]

    // Get subscriptions for these participants
    const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('subscription, user_id')
        .in('user_id', participantIds)

    if (!subscriptions || subscriptions.length === 0) {
        return { success: true, sent: 0 }
    }

    initVapid()

    const truncatedMessage = messageContent.length > 100
        ? messageContent.substring(0, 100) + '...'
        : messageContent

    const payload = JSON.stringify({
        title: `${senderName} in ${eventTitle}`,
        body: truncatedMessage,
        icon: '/icon.png',
        data: {
            type: 'event_chat',
            eventId: eventId,
            url: `/event/${eventId}`
        }
    })

    let sentCount = 0
    const failedUserIds: string[] = []

    await Promise.all(
        subscriptions.map(async ({ subscription, user_id }) => {
            try {
                await webpush.sendNotification(
                    subscription as unknown as PushSubscription,
                    payload
                )
                sentCount++
            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode
                    if (statusCode === 404 || statusCode === 410) {
                        failedUserIds.push(user_id!)
                    }
                }
            }
        })
    )

    // Clean up invalid subscriptions
    if (failedUserIds.length > 0) {
        await supabase
            .from('push_subscriptions')
            .delete()
            .in('user_id', failedUserIds)
    }

    return { success: true, sent: sentCount }
}