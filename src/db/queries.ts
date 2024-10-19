'use server';

import { db } from './index';
import {
  users,
  changelogs,
  pullRequests,
  changelogEntries,
  NewChangelogWithEntries,
  ChangelogWithEntries,
  PullRequest,
  commits,
  ChangelogEntry,
  ChangelogEntryWithPRsAndCommits,
} from './schema';
import { eq, desc, and, notInArray, inArray } from 'drizzle-orm';

// Users
export async function getUserByUsername(username: string) {
  return await db.select().from(users).where(eq(users.username, username)).limit(1);
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).limit(1);
}

export async function createUser(data: typeof users.$inferInsert) {
  console.log('Creating user in database: ', data);
  return await db.insert(users).values(data).returning();
}

// Changelogs
export async function getAllChangelogs() {
  return await db.select().from(changelogs);
}

export async function deleteChangelog(id: string) {
  await db.delete(changelogs).where(eq(changelogs.id, id));
  return { success: true, deletedId: id };
}

export async function updateChangelogWithEntries(
  id: string,
  updatedChangelog: ChangelogWithEntries
): Promise<ChangelogWithEntries> {
  console.log('Starting updateChangelogWithEntries with id:', id);

  return await db.transaction(async (tx) => {
    try {
      const now = new Date();

      // Update the main changelog
      const [updatedChangelogResult] = await tx
        .update(changelogs)
        .set({
          title: updatedChangelog.title,
          summary: updatedChangelog.summary,
          isPublished: updatedChangelog.isPublished,
          repositoryName: updatedChangelog.repositoryName,
          updatedAt: now,
        })
        .where(eq(changelogs.id, id))
        .returning();

      // Process entries, pull requests, and commits
      const updatedEntriesWithPRsAndCommits: ChangelogEntryWithPRsAndCommits[] = [];

      for (const entry of updatedChangelog.entries) {
        let updatedEntry: ChangelogEntry;
        if (entry.id) {
          // Update existing entry
          [updatedEntry] = await tx
            .update(changelogEntries)
            .set({
              message: entry.message,
              date: new Date(entry.date),
              tags: entry.tags,
              impact: entry.impact,
              technicalDetails: entry.technicalDetails,
              userBenefit: entry.userBenefit,
              breakingChange: entry.breakingChange,
            })
            .where(eq(changelogEntries.id, entry.id))
            .returning();
        } else {
          // Insert new entry
          [updatedEntry] = await tx
            .insert(changelogEntries)
            .values({
              changelogId: id,
              message: entry.message,
              date: new Date(entry.date),
              tags: entry.tags,
              impact: entry.impact,
              technicalDetails: entry.technicalDetails,
              userBenefit: entry.userBenefit,
              breakingChange: entry.breakingChange,
            })
            .returning();
        }

        // Process pull requests
        const updatedPRs: PullRequest[] = [];
        for (const pr of entry.pullRequests) {
          if (pr.id) {
            const [updatedPR] = await tx
              .update(pullRequests)
              .set({
                prNumber: pr.prNumber,
                title: pr.title,
                url: pr.url,
              })
              .where(eq(pullRequests.id, pr.id))
              .returning();
            updatedPRs.push(updatedPR);
          } else {
            const [newPR] = await tx
              .insert(pullRequests)
              .values({
                prNumber: pr.prNumber,
                title: pr.title,
                url: pr.url,
                changelogEntryId: updatedEntry.id,
              })
              .returning();
            updatedPRs.push(newPR);
          }
        }

        // Process commits
        const updatedCommits: (typeof commits.$inferSelect)[] = [];
        for (const commit of entry.commits) {
          if (commit.id) {
            const [updatedCommit] = await tx
              .update(commits)
              .set({
                hash: commit.hash,
                message: commit.message,
                author: commit.author,
                date: new Date(commit.date),
                pullRequestId: commit.pullRequestId,
              })
              .where(eq(commits.id, commit.id))
              .returning();
            updatedCommits.push(updatedCommit);
          } else {
            const [newCommit] = await tx
              .insert(commits)
              .values({
                hash: commit.hash,
                message: commit.message,
                author: commit.author,
                date: new Date(commit.date),
                changelogEntryId: updatedEntry.id,
                pullRequestId: commit.pullRequestId,
              })
              .returning();
            updatedCommits.push(newCommit);
          }
        }

        updatedEntriesWithPRsAndCommits.push({
          ...updatedEntry,
          pullRequests: updatedPRs,
          commits: updatedCommits,
        });
      }

      // Remove entries that are no longer present
      await tx.delete(changelogEntries).where(
        and(
          eq(changelogEntries.changelogId, id),
          notInArray(
            changelogEntries.id,
            updatedEntriesWithPRsAndCommits.map((e) => e.id)
          )
        )
      );

      const result: ChangelogWithEntries = {
        ...updatedChangelogResult,
        entries: updatedEntriesWithPRsAndCommits,
      };

      return result;
    } catch (error) {
      console.error('Error in updateChangelog transaction:', error);
      throw error;
    }
  });
}

export async function createChangelog(
  newChangeLogWithEntries: NewChangelogWithEntries
): Promise<ChangelogWithEntries> {
  return await db.transaction(async (tx) => {
    console.log('Beginning database transaction to insert changelog.');

    try {
      const [insertedChangelog] = await tx
        .insert(changelogs)
        .values(newChangeLogWithEntries)
        .returning();

      // Verify changelog insertion
      const verifyChangelog = await tx
        .select()
        .from(changelogs)
        .where(eq(changelogs.id, insertedChangelog.id))
        .limit(1);

      if (verifyChangelog.length === 0) {
        throw new Error('Failed to verify changelog insertion');
      }

      console.log('Verified changelog insertion');

      const insertedEntriesWithPRsAndCommits = [];

      for (let index = 0; index < newChangeLogWithEntries.entries.length; index++) {
        try {
          const entry = newChangeLogWithEntries.entries[index];

          const [insertedEntry] = await tx
            .insert(changelogEntries)
            .values({
              changelogId: insertedChangelog.id,
              message: entry.message,
              date: new Date(entry.date),
              tags: entry.tags,
              impact: entry.impact,
              technicalDetails: entry.technicalDetails,
              userBenefit: entry.userBenefit,
              breakingChange: entry.breakingChange,
            })
            .returning();

          let insertedPRs: PullRequest[] = [];
          if (entry.pullRequests && entry.pullRequests.length > 0) {
            insertedPRs = await tx
              .insert(pullRequests)
              .values(
                entry.pullRequests.map((pr) => ({
                  prNumber: pr.prNumber,
                  title: pr.title,
                  url: pr.url,
                  changelogEntryId: insertedEntry.id,
                }))
              )
              .returning();
          }

          const prMap = new Map(insertedPRs.map((pr) => [pr.prNumber, pr.id]));

          const insertedCommits = [];
          for (let commitIndex = 0; commitIndex < entry.commits.length; commitIndex++) {
            const commit = entry.commits[commitIndex];
            const [insertedCommit] = await tx
              .insert(commits)
              .values({
                hash: commit.hash,
                message: commit.message,
                author: commit.author,
                date: new Date(commit.date),
                changelogEntryId: insertedEntry.id,
                pullRequestId: prMap.get(Number(commit.pullRequestId)),
              })
              .returning();
            insertedCommits.push(insertedCommit);
          }

          insertedEntriesWithPRsAndCommits.push({
            ...insertedEntry,
            pullRequests: insertedPRs,
            commits: insertedCommits,
          });
        } catch (entryError) {
          console.error(`Error processing entry ${index + 1}:`, entryError);
          throw entryError;
        }
      }

      console.log('All entries processed successfully');

      return {
        ...insertedChangelog,
        entries: insertedEntriesWithPRsAndCommits,
      };
    } catch (error) {
      console.error('Error in createChangelog transaction:', error);
      throw error;
    }
  });
}

export async function getChangelogWithEntriesByChangelogId(
  changelogId: string
): Promise<ChangelogWithEntries | null> {
  console.log('Fetching changelog from database with id:', changelogId);
  const results = await db
    .select({
      changelog: changelogs,
      changelog_entry: changelogEntries,
      pull_request: pullRequests,
      commit: commits,
    })
    .from(changelogs)
    .where(eq(changelogs.id, changelogId))
    .leftJoin(changelogEntries, eq(changelogs.id, changelogEntries.changelogId))
    .leftJoin(pullRequests, eq(changelogEntries.id, pullRequests.changelogEntryId))
    .leftJoin(commits, eq(changelogEntries.id, commits.changelogEntryId));

  if (results.length === 0) {
    throw new Error(`No results found for changelog id: ${changelogId}`);
  }

  const changelog = results[0].changelog;
  const entries = results.reduce<Record<string, ChangelogEntryWithPRsAndCommits>>((acc, row) => {
    if (row.changelog_entry) {
      const entryId = row.changelog_entry.id;
      if (!acc[entryId]) {
        acc[entryId] = {
          ...row.changelog_entry,
          pullRequests: [],
          commits: [],
        };
      }
      if (row.pull_request) {
        acc[entryId].pullRequests.push(row.pull_request);
      }
      if (row.commit) {
        acc[entryId].commits.push(row.commit);
      }
    }
    return acc;
  }, {});

  return {
    ...changelog,
    entries: Object.values(entries),
  };
}

export async function getChangelogsByUserId(userId: string) {
  return await db
    .select()
    .from(changelogs)
    .where(eq(changelogs.userId, userId))
    .orderBy(desc(changelogs.updatedAt));
}
