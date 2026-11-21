// Keeps the free-plan Supabase project from being paused for inactivity
// (it was paused on 2026-11-20 after ~10 quiet days). A daily Vercel Schedule
// (`supabase-keep-alive` in vercel.json) invokes this privately — it has no
// public trigger — and one tiny read through PostgREST counts as activity.
// Idempotent: repeated deliveries just do the same harmless read.

import { handleSchedule } from '@vercel/schedules';

export const dynamic = 'force-dynamic';

export const POST = handleSchedule(async (metadata) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('Supabase env vars missing');
    }

    const res = await fetch(`${url}/rest/v1/seasons?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
    });
    if (!res.ok) {
        // Function targets aren't retried; this shows up as a 500 in the schedule's history.
        throw new Error(`Supabase ping failed with HTTP ${res.status}`);
    }

    console.log(`${metadata.name} run ${metadata.executionId} ok (scheduled ${metadata.scheduledAt.toISOString()})`);
});
