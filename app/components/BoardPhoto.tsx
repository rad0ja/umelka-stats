'use client';

import { useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Match } from "@/app/types";
import { boardPhotoUrl, removeBoardPhoto, uploadBoardPhoto } from "@/app/utils/boardPhoto";
import { STATS_HIDDEN } from "@/app/utils/statsMask";

type Props = {
    match: Match;
    // Logged-in users can add, replace and remove the photo
    canManage?: boolean;
};

// View button (+ add/replace/remove for logged-in users) for a match's board photo
export default function BoardPhoto({ match, canManage = false }: Props) {
    const [path, setPath] = useState(match.board_photo_path ?? null);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const fileInput = useRef<HTMLInputElement>(null);

    const onFileChosen = async (file: File | undefined) => {
        if (!file) return;
        setBusy(true);
        setError('');
        try {
            setPath(await uploadBoardPhoto(match.id, file, path));
        } catch (e: any) {
            setError(e.message || 'Upload failed');
        } finally {
            setBusy(false);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    const onRemove = async () => {
        if (!path || !confirm('Remove the board photo from this match?')) return;
        setBusy(true);
        setError('');
        try {
            await removeBoardPhoto(match.id, path);
            setPath(null);
        } catch (e: any) {
            setError(e.message || 'Removing failed');
        } finally {
            setBusy(false);
        }
    };

    if (!path && !canManage) return null;

    const buttonClass = "px-3 py-1 text-sm rounded border border-gray-400 dark:border-gray-500 disabled:opacity-60";

    return (
        <div className="mt-3 text-center">
            <div className="flex flex-wrap justify-center gap-2">
                {path && (STATS_HIDDEN ? (
                    // The photo shows the real tallies, so it stays hidden like the rest of the stats
                    <span className="px-3 py-1 text-sm text-gray-500">🤫 Board photo hidden until the finale</span>
                ) : (
                    <button onClick={() => setOpen(true)} className={buttonClass}>🖼️ Board photo</button>
                ))}
                {canManage && (
                    <>
                        <button onClick={() => fileInput.current?.click()} disabled={busy} className={buttonClass}>
                            {busy ? '⏳ Working...' : path ? '📷 Replace' : '📷 Add board photo'}
                        </button>
                        {path && (
                            <button onClick={onRemove} disabled={busy} className={buttonClass}>🗑️ Remove photo</button>
                        )}
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => onFileChosen(e.target.files?.[0])}
                        />
                    </>
                )}
            </div>
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-2">❌ {error}</p>}

            {path && !STATS_HIDDEN && (
                <BoardPhotoViewer match={match} path={path} open={open} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}

function BoardPhotoViewer({ match, path, open, onClose }: { match: Match; path: string; open: boolean; onClose: () => void }) {
    const url = boardPhotoUrl(path);

    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/85 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150"
            />
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-4xl text-white transition-all data-closed:opacity-0 data-closed:scale-95 data-enter:duration-200 data-leave:duration-150"
                >
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <DialogTitle as="h3" className="text-left">
                            <span className="block text-sm text-gray-300">{new Date(match.date).toLocaleDateString()}</span>
                            <span className="text-xl font-bold">
                                <span className="text-base">Team A</span> {match.score_a} : {match.score_b} <span className="text-base">Team B</span>
                            </span>
                        </DialogTitle>
                        <button onClick={onClose} aria-label="Close" className="text-2xl leading-none px-2">✕</button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Board photo of the match on ${match.date}`} className="w-full max-h-[75vh] object-contain rounded" />
                    <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-3 text-center text-sm underline text-blue-300">
                        Open full size ↗
                    </a>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
