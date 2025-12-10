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
                    router.push('/home');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/signup');
                }

            }
        );

        return () => subscription.subscription?.unsubscribe();
    }, [router]);

    return null;
}