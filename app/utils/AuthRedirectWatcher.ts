'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {supabase} from "@/lib/supabase";

export function AuthRedirectWatcher() {
    const router = useRouter();

    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    router.push('/me');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/');
                }

            }
        );

        return () => subscription.subscription?.unsubscribe();
    }, [router]);

    return null;
}