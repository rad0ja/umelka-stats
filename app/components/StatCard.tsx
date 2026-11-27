'use client'

interface StatsCardProps {
    value: number | string;
    title: string;
    subtitle?: string;
    emoji?: string;
    maxValue?: string | number;
    highlight?: boolean;
}

export default function StatCard({ value, title, subtitle, emoji, maxValue, highlight }: StatsCardProps) {
    return (
        <div className={`panel p-4 ${highlight ? "bg-bib! border-bib! text-ink" : ""}`}>
            <p className="num text-5xl leading-none">
                {value}
                {maxValue !== undefined && <span className="text-xl opacity-60"> / {maxValue}</span>}
            </p>
            <h3 className="mt-2 font-semibold">{emoji} {title}</h3>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
    )
}
