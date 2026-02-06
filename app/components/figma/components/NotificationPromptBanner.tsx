'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bell, X } from 'lucide-react'
import { registerPushToken } from '@/lib/firebase-client'

const STORAGE_KEY = 'notificationPromptDismissed'

export default function NotificationPromptBanner() {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Don't show if already dismissed
        if (localStorage.getItem(STORAGE_KEY)) return

        // Don't show if Notification API not supported
        if (!('Notification' in window)) return

        // Don't show if already granted or permanently denied
        if (Notification.permission === 'granted' || Notification.permission === 'denied') return

        setVisible(true)
    }, [])

    function dismiss() {
        localStorage.setItem(STORAGE_KEY, 'true')
        setVisible(false)
    }

    async function handleEnable() {
        setLoading(true)
        try {
            await registerPushToken()
        } catch (err) {
            console.error('Failed to register push token:', err)
        } finally {
            localStorage.setItem(STORAGE_KEY, 'true')
            setVisible(false)
        }
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="px-4 pb-2"
                >
                    <div
                        className="rounded-xl p-4 flex items-start gap-3 shadow-lg"
                        style={{ background: 'var(--stats-card)' }}
                    >
                        <div
                            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: 'rgba(0, 255, 135, 0.15)' }}
                        >
                            <Bell className="w-5 h-5" style={{ color: 'var(--stats-accent)' }} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: 'var(--stats-text)' }}>
                                Stay in the loop
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--stats-text-dim)' }}>
                                Get notified when you're promoted from the queue or someone sends a message.
                            </p>

                            <button
                                onClick={handleEnable}
                                disabled={loading}
                                className="mt-3 text-sm font-semibold px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-50"
                                style={{
                                    background: 'var(--stats-accent)',
                                    color: 'var(--stats-card)',
                                }}
                            >
                                {loading ? 'Enabling...' : 'Enable notifications'}
                            </button>
                        </div>

                        <button
                            onClick={dismiss}
                            className="shrink-0 p-1 rounded-full transition-colors hover:bg-white/10"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" style={{ color: 'var(--stats-text-dim)' }} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
