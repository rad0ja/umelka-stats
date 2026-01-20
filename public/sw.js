self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || '/icon.png',
            badge: '/badge.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                type: data.data?.type || 'general',
                url: data.data?.url || '/figma',
            },
            tag: data.data?.type === 'chat' ? 'chat-message' : 'general',
            renotify: true,
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close()

    const urlToOpen = event.notification.data?.url || '/figma'

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes('/figma') && 'focus' in client) {
                    return client.focus()
                }
            }
            // Open a new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen)
            }
        })
    )
})