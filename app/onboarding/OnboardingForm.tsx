'use client'

import { useState } from 'react'
import { createTeam, joinTeam } from './actions'

type Mode = 'join' | 'create'

export default function OnboardingForm({
    error,
    message,
}: {
    error?: string
    message?: string
}) {
    const [mode, setMode] = useState<Mode>('join')

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white px-8 py-10 shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center mb-2">Welcome!</h1>
                    <p className="text-center text-gray-600 mb-8">
                        Join an existing team or create a new one to get started.
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setMode('join')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                mode === 'join'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Join Team
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('create')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                mode === 'create'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Create Team
                        </button>
                    </div>

                    {mode === 'join' ? (
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Invite Code
                                </label>
                                <input
                                    id="inviteCode"
                                    name="inviteCode"
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-widest text-center text-lg font-mono"
                                    placeholder="ABC123"
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                formAction={joinTeam}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Join Team
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Name
                                </label>
                                <input
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="My Football Team"
                                />
                            </div>

                            <button
                                formAction={createTeam}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Create Team
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
