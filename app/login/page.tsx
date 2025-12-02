'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailSign, setEmailSign] = useState('');
    const [passwordSign, setPasswordSign] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else router.push('/add-match');
    };

    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({
            email: emailSign,
            password: passwordSign,
            options: {
                data: { name: username },
            }});
        if (error) alert(error.message);
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
                Login
            </button>

            <h1 className="text-xl font-bold mb-4">SignUp</h1>
            <input
                type="username"
                placeholder="Username"
                className="border p-2 w-full mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={emailSign}
                onChange={(e) => setEmailSign(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                value={passwordSign}
                onChange={(e) => setPasswordSign(e.target.value)}
            />
            <button onClick={handleSignUp} className="bg-blue-600 text-white px-4 py-2 rounded">
                SIgnUp
            </button>
        </div>
    );
}
