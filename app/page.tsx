import Link from 'next/link'
import { createClient } from '@/lib/server'

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white pt-safe">
            <div className="text-center space-y-8 px-4">
                <h1 className="text-5xl font-bold text-gray-900">
                    Welcome to Your App
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl">
                    A modern authentication system built with Next.js 15 and Supabase
                </p>

                <div className="flex gap-4 justify-center">
                    {user ? (
                        <Link
                            href="/figma"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/login"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}