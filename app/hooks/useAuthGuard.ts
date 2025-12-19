'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';

export function useAuthGuard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const supabase = createClient();

    useEffect(() => {
        console.log("🔍 Fetching useAuth");
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push('/login');
            } else {
                setUser(data.user);
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    return { user, loading };
}
