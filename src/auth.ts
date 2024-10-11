import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    adapter: DrizzleAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30,
    },
    secret: process.env.AUTH_SECRET!,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    redirect_uri: `${process.env
                        .NEXT_PUBLIC_AUTH_URL!}/api/auth/callback/github`,
                },
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    // callbacks: {
    //     authorized: async ({ auth }) => {
    //         // Logged in users are authenticated, otherwise redirect to login page
    //         return !!auth;
    //     },
    // },
    // cookies: {
    //     pkceCodeVerifier: {
    //         name: 'next-auth.pkce.code_verifier',
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'none',
    //             path: '/',
    //             secure: process.env.NODE_ENV === 'production',
    //         },
    //     },
    // },
});
