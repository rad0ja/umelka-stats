'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { uploadBoardPhoto } from "@/app/utils/boardPhoto";

export default function LiveMatchSummary({ teamA, teamB, goals, assists = {}, onDone }: any) {
    const [comments, setComments] = useState('');
    const [jerseyPlayerId, setJerseyPlayerId] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [saveError, setSaveError] = useState('');
    // Board photo: picked here, uploaded only after the match row exists (it's stored under the match id)
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [photoStatus, setPhotoStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
    const [photoError, setPhotoError] = useState('');
    const [savedMatchId, setSavedMatchId] = useState('');

    useEffect(() => {
        if (!photo) return;
        const url = URL.createObjectURL(photo);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photo]);
    const totalA = teamA.reduce((sum: any, p: { id: string | number; }) => sum + (goals[p.id] || 0), 0);
    const totalB = teamB.reduce((sum: any, p: { id: string | number; }) => sum + (goals[p.id] || 0), 0);

    const scorersA = teamA.filter((p: any) => {
        return (goals[p.id] || 0) > 0 || (assists[p.id] || 0) > 0;
    });

    const scorersB = teamB.filter((p: any) => {
        return (goals[p.id] || 0) > 0 || (assists[p.id] || 0) > 0;
    });

    const uploadPhoto = async (matchId: string) => {
        if (!photo) return;
        setPhotoStatus('uploading');
        setPhotoError('');
        try {
            await uploadBoardPhoto(matchId, photo);
            setPhotoStatus('done');
        } catch (e: any) {
            console.error(e);
            setPhotoError(e.message || 'Unknown error');
            setPhotoStatus('error');
        }
    };

    const submitMatch = async () => {
        if (saveStatus === 'saving' || saveStatus === 'success') return;
        setSaveStatus('saving');
        setSaveError('');
        const { data, error } = await supabase.from('matches').insert({
            team_a: teamA.map((p: { id: any; }) => p.id),
            team_b: teamB.map((p: { id: any; }) => p.id),
            score_a: totalA,
            score_b: totalB,
            goals,
            comments,
            assists,
            date: new Date().toISOString().slice(0, 10),
            season_id: 10,
            jersey_player_id: jerseyPlayerId || null
        }).select('id').single();
        if (error) {
            console.error(error);
            setSaveError(error.message || 'Unknown error');
            setSaveStatus('error');
        } else {
            // The match is saved either way; a failed photo upload can be retried on the success screen
            setSaveStatus('success');
            setSavedMatchId(data.id);
            await uploadPhoto(data.id);
        }
    };

    if (saveStatus === 'success') {
        return (
            <div className="p-4">
                <div role="status" className="mb-4 p-4 rounded border border-green-600 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                    <p className="font-bold text-lg">✅ Match saved successfully!</p>
                    <p className="text-sm mt-1">Final score: 🟦 {totalA} : {totalB} 🟥</p>
                </div>
                {photoStatus === 'uploading' && (
                    <p role="status" className="mb-4 text-sm">⏳ Uploading board photo...</p>
                )}
                {photoStatus === 'done' && (
                    <p role="status" className="mb-4 text-sm">🖼️ Board photo attached.</p>
                )}
                {photoStatus === 'error' && (
                    <div role="alert" className="mb-4 p-3 rounded border border-red-600 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">
                        <p className="font-semibold">❌ The board photo didn't upload (the match itself is saved).</p>
                        {photoError && <p className="text-sm mt-1">{photoError}</p>}
                        <button onClick={() => uploadPhoto(savedMatchId)} className="w-full mt-2 bg-red-600 text-white py-2 rounded">
                            🔁 Retry photo upload
                        </button>
                    </div>
                )}
                <button onClick={onDone} className="w-full bg-blue-600 text-white py-2 rounded">
                    ➕ Start new match
                </button>
                <Link href="/" className="block w-full mt-2 text-center bg-gray-600 text-white py-2 rounded">
                    🏠 Back to dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">📊 Match Summary</h2>
            <div className="mb-4">
                <p>🟦 Team A: {totalA}</p>
                <p>🟥 Team B: {totalB}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 className="font-semibold mb-2">⚽ Team A scorers</h3>
                    {scorersA.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {scorersA.map((p: any) => (
                                <li key={p.id}>
                                    {p.name || p.id}: G: {goals[p.id] || 0} A: {assists[p.id] || 0}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No goals scored</p>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold mb-2">⚽ Team B scorers</h3>
                    {scorersB.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {scorersB.map((p: any) => (
                                <li key={p.id}>
                                    {p.name || p.id}: G: {goals[p.id] || 0} A: {assists[p.id] || 0}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No goals scored</p>
                    )}
                </div>
            </div>
            <div>
                <textarea 
                    value={comments} 
                    onChange={e => setComments(e.target.value)} 
                    placeholder="Add comments about the match..." 
                    className="w-full p-2 border rounded mb-4" />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-2">👕 Jersey service (takes the jerseys home)</label>
                <select
                    value={jerseyPlayerId}
                    onChange={e => setJerseyPlayerId(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-black dark:text-white"
                >
                    <option value="">Nobody</option>
                    {[...teamA, ...teamB].map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name || p.id}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-2">🖼️ Board photo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setPhoto(e.target.files?.[0] ?? null)}
                    className="w-full text-sm file:mr-3 file:px-3 file:py-1 file:rounded file:border file:border-gray-400 file:bg-transparent"
                />
                {photo && photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="Selected board photo" className="mt-2 max-h-48 rounded border" />
                ) : (
                    <p className="text-sm text-gray-500 mt-1">No board photo yet — you can add it later from the matches page.</p>
                )}
            </div>

            {saveStatus === 'error' && (
                <div role="alert" className="mb-4 p-3 rounded border border-red-600 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">
                    <p className="font-semibold">❌ Saving the match failed. Please try again.</p>
                    {saveError && <p className="text-sm mt-1">{saveError}</p>}
                </div>
            )}

            <button
                onClick={submitMatch}
                disabled={saveStatus === 'saving'}
                className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'error' ? '🔁 Retry Save' : '✅ Confirm & Save'}
            </button>
        </div>
    );
}
