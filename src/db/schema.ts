import { timestamp, pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
});

export const changelogs = pgTable('changelog', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    content: text('content').array().notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(
        () => new Date()
    ),
    updatedAt: timestamp('updatedAt', { mode: 'date' })
        .$defaultFn(() => new Date())
        .notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    repositoryName: text('repositoryName').notNull(),
});
