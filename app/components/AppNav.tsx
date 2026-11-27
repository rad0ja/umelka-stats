'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/", label: "Home" },
    { href: "/stats", label: "Tables" },
    { href: "/matches", label: "Matches" },
    { href: "/teams", label: "Teams" },
    { href: "/summary", label: "Season" },
];

export default function AppNav() {
    const pathname = usePathname();

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    return (
        <header className="sticky top-0 z-20 bg-pitch-deep text-white shadow-md pt-[env(safe-area-inset-top)]">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-x-4 px-4">
                <Link href="/" className="font-display italic font-extrabold text-2xl py-2 whitespace-nowrap">
                    Umelka<span className="text-bib"> League</span>
                </Link>
                <nav aria-label="Main" className="hidden sm:block flex-1 overflow-x-auto">
                    <ul className="flex sm:justify-end gap-1 -mx-3 sm:mx-0">
                        {TABS.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    aria-current={isActive(href) ? "page" : undefined}
                                    className={`block px-3 py-3.5 text-sm font-semibold border-b-4 whitespace-nowrap transition-colors ${
                                        isActive(href)
                                            ? "border-bib text-white"
                                            : "border-transparent text-white/70 hover:text-white"
                                    }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
