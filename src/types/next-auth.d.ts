import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        justSignedIn?: boolean;
        accessToken?: string;
    }
}
