export type TabType = 'stats' | 'matches' | 'chat' | 'profile';

export type Tab = {
    id: TabType;
    label: string;
    icon: React.ElementType;
    href: string;
}

export const TABS: TabType[] = ['stats', 'matches', 'chat', 'profile'];