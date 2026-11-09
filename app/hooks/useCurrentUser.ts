'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Like useAuthGuard, but never redirects: public pages use it to show extra controls to logged-in users.
// Only decides what to show; Supabase RLS is what actually blocks writes.
export function useCurrentUser() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    return user;
}
