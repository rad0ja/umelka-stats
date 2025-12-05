'use client';
import {supabase} from "@/lib/supabase";
import { useEffect, useState } from 'react';

import Link from 'next/link';
import LogoutButton from "@/app/components/login/LogoutButton";
import LoginButton from "@/app/components/login/LoginButton";

export default function Navigace() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <nav className="p-4 flex justify-between bg-gray-100">
            <Link href="/" className="font-bold">🏟 Umelka League</Link>

            <div className="flex gap-2">
                {user ? (
                    <>
                        <Link href="/me" className="px-3 py-2 bg-green-600 text-white rounded">
                            📊 My Dashboard
                        </Link>
                        <LogoutButton />
                    </>
                ) : (
                    <LoginButton />
                )}
            </div>
        </nav>
    );
}
