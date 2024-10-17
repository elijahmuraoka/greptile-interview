import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL! + '?sslmode=require',
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  verbose: true,
  strict: true,
});
