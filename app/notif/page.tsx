import InstallPrompt from '@/app/notif/InstallPrompt'
import PushNotificationManager from '@/app/notif/PushNotificationManager'

export default function Page() {
    return (
        <div>
            <PushNotificationManager />
            <InstallPrompt />
        </div>
    )
}