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
    callbacks: {
        async session({ session, token }) {
            if (token.justSignedIn) {
                session.justSignedIn = true;
                // Reset the flag immediately after use
                token.justSignedIn = false;
            } else {
                session.justSignedIn = false;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                // This means it's a sign in event
                token.justSignedIn = true;
            }
            return token;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
});
