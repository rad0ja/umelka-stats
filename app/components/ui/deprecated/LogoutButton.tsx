import { logout } from '@/app/actions'

export default function LogoutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
                Sign Out
            </button>
        </form>
    )
}