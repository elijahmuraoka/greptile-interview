import { timestamp, pgTable, text, integer, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const changelogs = pgTable('changelog', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  isPublished: boolean('isPublished').default(false),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  userId: uuid('userId').notNull(),
  repositoryName: text('repositoryName').notNull(),
});

export const changelogEntries = pgTable('changelog_entry', {
  id: uuid('id').primaryKey().defaultRandom(),
  changelogId: uuid('changelogId')
    .notNull()
    .references(() => changelogs.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  tags: text('tags').array(),
  impact: text('impact'),
  technicalDetails: text('technicalDetails'),
  userBenefit: text('userBenefit'),
  breakingChange: boolean('breakingChange').default(false),
});

export const commits = pgTable('commit', {
  id: uuid('id').primaryKey().defaultRandom(),
  hash: text('hash').notNull(),
  message: text('message').notNull(),
  author: text('author').notNull(),
  date: timestamp('date').notNull(),
  changelogEntryId: uuid('changelogEntryId')
    .notNull()
    .references(() => changelogEntries.id, { onDelete: 'cascade' }),
  pullRequestId: uuid('pullRequestId').references(() => pullRequests.id, {
    onDelete: 'set null',
  }),
});

export const pullRequests = pgTable('pull_request', {
  id: uuid('id').primaryKey().defaultRandom(),
  prNumber: integer('prNumber').notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  changelogEntryId: uuid('changelogEntryId')
    .notNull()
    .references(() => changelogEntries.id, { onDelete: 'cascade' }),
});

// Define relations
export const changelogsRelations = relations(changelogs, ({ many }) => ({
  entries: many(changelogEntries),
}));

export const changelogEntriesRelations = relations(changelogEntries, ({ one, many }) => ({
  changelog: one(changelogs, {
    fields: [changelogEntries.changelogId],
    references: [changelogs.id],
  }),
  commits: many(commits),
  pullRequests: many(pullRequests),
}));

export const commitsRelations = relations(commits, ({ one }) => ({
  changelogEntry: one(changelogEntries, {
    fields: [commits.changelogEntryId],
    references: [changelogEntries.id],
  }),
  pullRequest: one(pullRequests, {
    fields: [commits.pullRequestId],
    references: [pullRequests.id],
  }),
}));

export const pullRequestsRelations = relations(pullRequests, ({ one, many }) => ({
  changelogEntry: one(changelogEntries, {
    fields: [pullRequests.changelogEntryId],
    references: [changelogEntries.id],
  }),
  commits: many(commits),
}));

// Types for Drizzle ORM
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Changelog = typeof changelogs.$inferSelect;
export type NewChangelog = typeof changelogs.$inferInsert;

export type ChangelogEntry = typeof changelogEntries.$inferSelect;
export type NewChangelogEntry = typeof changelogEntries.$inferInsert;

export type Commit = typeof commits.$inferSelect;
export type NewCommit = typeof commits.$inferInsert;

export type PullRequest = typeof pullRequests.$inferSelect;
export type NewPullRequest = typeof pullRequests.$inferInsert;

export type ChangelogEntryWithPRsAndCommits = ChangelogEntry & {
  pullRequests: PullRequest[];
  commits: Commit[];
};

export type NewChangelogEntryWithPRsAndCommits = NewChangelogEntry & {
  pullRequests: NewPullRequest[];
  commits: NewCommit[];
};

export type ChangelogWithEntries = Changelog & {
  entries: ChangelogEntryWithPRsAndCommits[];
};

export type NewChangelogWithEntries = NewChangelog & {
  entries: NewChangelogEntryWithPRsAndCommits[];
};

export type ChangelogWithUser = Changelog & {
  user: User;
};
