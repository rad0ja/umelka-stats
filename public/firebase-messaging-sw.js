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

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icon-192x192.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
