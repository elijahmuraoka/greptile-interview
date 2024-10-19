import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      image: string;
      html_url: string;
    };
  }
}
