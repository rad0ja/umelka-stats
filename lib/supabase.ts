'use client';

import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL in client:", supabaseUrl);
console.log("Supabaes anon key", supabaseAnonKey);

export const supabase = createBrowserClient (supabaseUrl ?? '', supabaseAnonKey ?? '')

console.log("supabase clietn initialized");