'use client';

import { createClient } from "@supabase/supabase-js";
// import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const options = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
}

export const supabase = createClient (supabaseUrl ?? '', supabaseAnonKey ?? '', options)

console.log("supabase client initialized");