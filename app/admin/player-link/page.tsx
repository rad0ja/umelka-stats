'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function PlayerLinkPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const { data: playersData } = await supabase
                .from('players')
                .select('*')
                .order('name', { ascending: true });

            const { data: usersData } = await supabase
                .from('player_users_view')
                .select('*');

            setPlayers(playersData || []);
            setUsers(usersData || []);
            setLoading(false);
        };

        loadData();
    }, []);

    const linkPlayer = async (playerId: string, userId: string) => {
        await supabase
            .from('players')
            .update({ user_id: userId })
            .eq('id', playerId);

        alert('✔ Player linked successfully!');
        window.location.reload();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">🔗 Link Players to Auth Users</h1>

            {players.map(player => {
                const linkedUser = users.find(u => u.user_id === player.user_id);
                return (
                    <div key={player.id} className="border p-4 rounded bg-white shadow-sm">
                        <p className="font-semibold">{player.name}</p>

                        <select
                            className="border p-2 mt-2"
                            value={player.user_id || ''}
                            onChange={(e) => linkPlayer(player.id, e.target.value)}
                        >
                            <option value="">— Not Linked —</option>
                            {users.map(u => (
                                <option key={u.user_id} value={u.user_id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>

                        {linkedUser && (
                            <p className="text-sm text-green-600 mt-1">
                                ✔ {linkedUser.email}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
