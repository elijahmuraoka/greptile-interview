import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    out: './drizzle',
    dbCredentials: {
        url: process.env.POSTGRES_URL! + '?sslmode=require',
    },
    verbose: true,
    strict: true,
});
