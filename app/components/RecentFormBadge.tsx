// components/RecentFormBadge.tsx
'use client';

export default function RecentFormBadge({ form }: { form: string[] }) {
    return (
        <div className="flex gap-0.5" aria-label={`Recent form: ${form.join(" ")}`}>
            {form.map((result, idx) => (
                <span
                    key={idx}
                    className={`num w-5 h-5 grid place-items-center rounded-sm text-xs text-white ${
                        result === "W"
                            ? "bg-pitch"
                            : result === "L"
                                ? "bg-red-card"
                                : "bg-gray-400" // Draw
                    }`}
                >
                    {result}
                </span>
            ))}
        </div>
    )
}
