import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getTeamForUser } from '@/app/data/getTeamForUser'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const team = await getTeamForUser()

    if (team) {
        // Set the cookie so middleware won't redirect here again
        const cookieStore = await cookies()
        cookieStore.set('hasTeam', 'true', { path: '/' })
        redirect('/stats')
    }

    const { error, message } = await searchParams

    return <OnboardingForm error={error} message={message} />
}
