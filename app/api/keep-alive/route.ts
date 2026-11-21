// Keeps the free-plan Supabase project from being paused for inactivity
// (it was paused on 2026-11-20 after ~10 quiet days). Vercel Cron calls this
// daily (see vercel.json); one tiny read through PostgREST counts as activity.

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        return Response.json({ ok: false, error: 'Supabase env vars missing' }, { status: 500 });
    }

    const res = await fetch(`${url}/rest/v1/seasons?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
    });

    return Response.json(
        { ok: res.ok, status: res.status, at: new Date().toISOString() },
        { status: res.ok ? 200 : 502 },
    );
}
