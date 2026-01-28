'use client'

import { initializeApp, getApps } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"
import { createClient } from "@/lib/client"

const firebaseConfig = {
    apiKey: "AIzaSyBXa4Ph4MkICouj9fu6CZoPlkL49wDG7Ow",
    authDomain: "my-fotbalek-notif.firebaseapp.com",
    projectId: "my-fotbalek-notif",
    storageBucket: "my-fotbalek-notif.firebasestorage.app",
    messagingSenderId: "941802246275",
    appId: "1:941802246275:web:2e9cc37b51192bba85cbb6",
    measurementId: "G-DV1J07PTFP"
};

function getFirebaseApp() {
    if (getApps().length === 0) {
        return initializeApp(firebaseConfig);
    }
    return getApps()[0];
}

export async function registerPushToken() {
    if (typeof window === 'undefined') {
        console.log('Push notifications only work in the browser');
        return;
    }

    try {
        // Register service worker first
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered:', registration);

        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);

        if (permission !== 'granted') {
            console.log('Permission not granted for Notification');
            return;
        }

        const firebaseApp = getFirebaseApp();
        const messaging = getMessaging(firebaseApp);

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        console.log('FCM token:', token);

        if (!token) {
            console.log('No token received');
            return;
        }

        // Get user's session token for authorization
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            console.log('No session found');
            return;
        }

        const response = await fetch("https://qmlrwxnezaqfitmnhhlz.supabase.co/functions/v1/save-fcm-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ token })
        });

        const responseText = await response.text();
        console.log('Save token response:', response.status, responseText);
        return token;
    } catch (error) {
        console.error('Error registering push token:', error);
    }
}
