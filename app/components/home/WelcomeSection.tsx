interface WelcomeSectionProps {
    userName: string;
}

export default function WelcomeSection({ userName}: WelcomeSectionProps){
    return (
        <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-emerald-600">{userName}</span>!
            </h1>
            <p className="text-gray-600">Here's what's happening with your soccer community</p>
        </div>
    );
};
