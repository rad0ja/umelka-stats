'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Player = {
    id: string;
    name: string;
};

export default function PlayerManager() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const fetchPlayers = async () => {
        const { data, error } = await supabase.from('players').select('*').order('name');
        if (error) console.error('Error fetching players:', error);
        else setPlayers(data);
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const addPlayer = async () => {
        if (!newName.trim()) return;
        const { error } = await supabase.from('players').insert([{ name: newName.trim() }]);
        if (error) console.error('Error adding player:', error);
        setNewName('');
        fetchPlayers();
    };

    const updatePlayer = async (id: string) => {
        const { error } = await supabase.from('players').update({ name: editingName }).eq('id', id);
        if (error) console.error('Error updating player:', error);
        setEditingId(null);
        setEditingName('');
        fetchPlayers();
    };

    const deletePlayer = async (id: string) => {
        const { error } = await supabase.from('players').delete().eq('id', id);
        if (error) console.error('Error deleting player:', error);
        fetchPlayers();
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Players</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New player name"
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={addPlayer}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {players.map((player) => (
                    <li key={player.id} className="flex items-center justify-between border p-2 rounded">
                        {editingId === player.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="border p-1 rounded w-full mr-2"
                                />
                                <button
                                    onClick={() => updatePlayer(player.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{player.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(player.id);
                                            setEditingName(player.name);
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deletePlayer(player.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
