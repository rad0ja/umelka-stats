import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
    const res = NextResponse.next();

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!user || user.email !== "janrdch@gmail.com") {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    return res;
}
