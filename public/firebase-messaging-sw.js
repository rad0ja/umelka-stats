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

// All push notifications (chat, event chat, promotion) arrive as FCM data-only messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'New notification';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: '/icon-192x192.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: payload.data,
        tag: payload.data?.type === 'chat' ? 'chat-message' : 'general',
        renotify: true,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler — routes to the appropriate page
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
