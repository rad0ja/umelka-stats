'use client'

import SeasonPicker from "@/app/components/SeasonPicker";
import SignUp from "@/app/components/SignUp";

export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>
            <SignUp />
        </div>
    )
}