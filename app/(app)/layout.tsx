import { BottomTabNavigation } from '@/app/components/figma/components/BottomTabNavigation';
import NotificationPromptBanner from '@/app/components/figma/components/NotificationPromptBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md mx-auto bg-red-50 relative overflow-y-hidden safe-area-pt min-h-[100dvh] flex flex-col">
      <div className="flex-1 min-h-0 safe-area-pt">
        {children}
      </div>
      <NotificationPromptBanner />
      <BottomTabNavigation />
    </div>
  );
}
