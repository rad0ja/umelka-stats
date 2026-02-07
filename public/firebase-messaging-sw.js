importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBXa4Ph4MkICouj9fu6CZoPlkL49wDG7Ow",
    authDomain: "my-fotbalek-notif.firebaseapp.com",
    projectId: "my-fotbalek-notif",
    storageBucket: "my-fotbalek-notif.firebasestorage.app",
    messagingSenderId: "941802246275",
    appId: "1:941802246275:web:2e9cc37b51192bba85cbb6",
    measurementId: "G-DV1J07PTFP"
});

const messaging = firebase.messaging();

// --- FCM background messages (data-only and notification payloads) ---
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    // Support both notification payloads and data-only payloads
    const notificationTitle = payload.notification?.title || payload.data?.title || 'New notification';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: '/icon-192x192.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- Web Push (VAPID) messages ---
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
                url: data.data?.url || '/stats',
            },
            tag: data.data?.type === 'chat' ? 'chat-message' : 'general',
            renotify: true,
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

// --- Notification click handler (shared by both FCM and Web Push) ---
self.addEventListener('notificationclick', function (event) {
    event.notification.close()

    const urlToOpen = event.notification.data?.url || '/stats'

    const appPaths = ['/stats', '/matches', '/chat', '/profile', '/event']

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (appPaths.some(function (p) { return client.url.includes(p) }) && 'focus' in client) {
                    client.navigate(urlToOpen)
                    return client.focus()
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen)
            }
        })
    )
})
