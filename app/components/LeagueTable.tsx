'use client';

import Link from "next/link";
import { Player } from "@/app/types";
import { getPlayerName } from "@/app/utils/playerHelpers";

export type LeagueRow = {
    id: string;
    value: string | number;
    detail?: string;
    name?: string;
};

type Props = {
    title: string;
    note?: string;
    unit?: string;
    rows: LeagueRow[];
    players?: Player[];
    action?: React.ReactNode;
};

export default function LeagueTable({ title, note, unit, rows, players, action }: Props) {
    return (
        <section className="panel overflow-hidden">
            <header className="flex items-center justify-between gap-2 bg-pitch text-white px-4 py-2.5">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">{title}{action}</h2>
                {unit && <span className="text-xs text-white/70">{unit}</span>}
            </header>
            {note && <p className="text-xs text-muted px-4 pt-2">{note}</p>}
            <ol>
                {rows.map((row, index) => (
                    <li
                        key={row.id}
                        className={`flex items-center gap-3 px-4 py-2 border-b border-line last:border-b-0 ${
                            index === 0 ? "bg-bib/20" : ""
                        }`}
                    >
                        <span
                            className={`num w-7 h-7 shrink-0 grid place-items-center rounded-full text-sm ${
                                index === 0
                                    ? "bg-bib text-ink"
                                    : index < 3
                                        ? "bg-pitch text-white"
                                        : "text-muted"
                            }`}
                        >
                            {index + 1}
                        </span>
                        <Link href={`/players/${row.id}`} className="flex-1 min-w-0 truncate font-medium hover:underline">
                            {row.name ?? getPlayerName(players ?? [], row.id)}
                        </Link>
                        {row.detail && <span className="text-xs text-muted">{row.detail}</span>}
                        <span className="num text-xl min-w-8 text-right">{row.value}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
