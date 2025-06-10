// components/RecentFormBadge.tsx
'use client';

export default function RecentFormBadge({ form }: { form: string[] }) {
    return (
        <div className="flex space-x-1">
            {form.map((result, idx) => (
                <span
                    key={idx}
                    className={`text-xs font-bold px-2 py-1 rounded ${
                        result === 'W' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {result}
                </span>
            ))}
        </div>
    )
}