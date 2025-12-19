import { signup } from './actions'
import Link from 'next/link'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white px-8 py-10 shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
                        </div>

                        <button
                            formAction={signup}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}