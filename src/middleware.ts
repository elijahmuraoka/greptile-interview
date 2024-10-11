import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
export { auth as middleware } from '@/auth';

// export async function middleware(req: NextRequest) {
//     const res = NextResponse.next();
//     const session = await auth();

//     // Check if the user is authenticated for protected routes
//     if (
//         req.nextUrl.pathname.startsWith('/dashboard') ||
//         req.nextUrl.pathname.startsWith('/generate-changelog')
//     ) {
//         if (!session) {
//             return NextResponse.redirect(new URL('/api/auth/signin', req.url));
//         }
//     }

//     return res;
// }

export const config = {
    matcher: ['/dashboard/:path*', '/generate-changelog/:path*'],
};
