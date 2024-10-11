# AI-Powered Changelog Generator

This is a Next.js application that generates changelogs using AI based on commit messages.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables in `.env.local`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js
   - `GITHUB_ID` and `GITHUB_SECRET`: Your GitHub OAuth app credentials (if using GitHub authentication)
4. Set up your database:
   - Run `npx prisma generate` to generate the Prisma client
   - Run `npx prisma db push` to sync your database schema
5. Run the development server: `npm run dev`

## Features

- AI-powered changelog generation based on commit messages
- Public-facing changelog page
- User authentication (optional, for accessing the changelog generator)

## Technologies Used

- Next.js
- Prisma
- NextAuth.js (optional)
- Tailwind CSS
- OpenAI API (or any other AI service for generating changelogs)

## Usage

1. Navigate to the "Generate Changelog" page
2. Paste your commit messages into the text area
3. Click "Generate Changelog" to create a new changelog entry
4. View the public changelog on the "Changelog" page

## Note on AI Integration

This project uses a placeholder function for generating changelogs. To fully implement the AI functionality, you would need to integrate with an AI service like OpenAI's GPT-3 or GPT-4. The integration would involve sending the commit messages to the AI service and receiving a generated changelog in return.
