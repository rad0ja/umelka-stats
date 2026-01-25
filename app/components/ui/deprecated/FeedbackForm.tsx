'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FeedbackForm() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.from('feedback').insert([
            { message, name },
        ]);

        if (error) {
            console.error('Submission error:', error);
            setError('Something went wrong. Please try again.');
        } else {
            setSent(true);
            setMessage('');
            setName('');
        }
    };

    if (sent) {
        return (
            <div className="max-w-md mx-auto mt-6 text-green-600 text-center">
                ✅ Thanks for your feedback!
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="text-center object-bottom-right max-w-md mx-auto p-6 mt-6 bg-white dark:bg-black rounded shadow space-y-4"
        >
            <h2 className="text-xl font-bold">💬 Send Feedback</h2>

            <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What could be improved or added?"
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-800"
            />

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full p-2 border rounded dark:bg-gray-800"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit Feedback
            </button>
        </form>
    );
}
