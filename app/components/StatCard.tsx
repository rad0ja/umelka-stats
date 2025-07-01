'use client'

interface StatsCardProps {
    value: number | string;
    title: string;
    subtitle: string;
    emoji?: string;
    maxValue?: string | number;
}

export default function StatCard({ value, title, subtitle, emoji, maxValue }: StatsCardProps) {
    return (
        <div
            className="flex justify-center items-center p-6 text-center bg-gray-100 rounded xl:p-12 dark:bg-gray-800">
            <div className="text-gray-900 dark:text-white">
                <p className="mb-2 text-4xl font-extrabold md:text-5xl">
                    {maxValue !== undefined ? `${value} of ${maxValue}` : value}
                </p>
                <h3 className="mb-2 text-xl font-semibold">{emoji} {title}</h3>
                <p className="font-light text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
        </div>
    )
}