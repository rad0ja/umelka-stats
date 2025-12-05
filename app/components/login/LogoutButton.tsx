'use client';

import {supabase} from "@/lib/supabase";

export default function LogoutButton() {
    return (
        <button
            onClick={() => supabase.auth.signOut()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
            🚪 Logout
        </button>
    );
}
