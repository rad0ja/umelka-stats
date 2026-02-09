import { redirect } from 'next/navigation'
import { getTeamForUser } from '@/app/data/getTeamForUser'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const team = await getTeamForUser()

    if (team) {
        redirect('/stats')
    }

    const { error, message } = await searchParams

    return <OnboardingForm error={error} message={message} />
}
