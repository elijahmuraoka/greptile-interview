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
} from './schema';
import { eq, desc } from 'drizzle-orm';

// Users
export async function getUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email)).limit(1);
}

export async function createUser(data: typeof users.$inferInsert) {
    console.log('Creating user in database: ', data);
    return await db.insert(users).values(data).returning();
}

// Changelogs
export async function getAllChangelogs() {
    return await db.select().from(changelogs);
}

export async function createChangelog(
    newChangeLogWithEntries: NewChangelogWithEntries
): Promise<ChangelogWithEntries> {
    return await db.transaction(async (tx) => {
        console.log('Beginning database transaction');

        try {
            const [insertedChangelog] = await tx
                .insert(changelogs)
                .values(newChangeLogWithEntries)
                .returning();

            console.log('Inserted changelog:', insertedChangelog);

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

            for (
                let index = 0;
                index < newChangeLogWithEntries.entries.length;
                index++
            ) {
                try {
                    const entry = newChangeLogWithEntries.entries[index];
                    console.log(`Processing entry ${index + 1}`);

                    const [insertedEntry] = await tx
                        .insert(changelogEntries)
                        .values({
                            changelogId: insertedChangelog.id,
                            message: entry.message,
                            tags: entry.tags,
                            impact: entry.impact,
                            breakingChange: entry.breakingChange,
                        })
                        .returning();

                    console.log(
                        `Inserted changelog entry ${index + 1}:`,
                        insertedEntry
                    );

                    let insertedPRs: PullRequest[] = [];
                    if (entry.pullRequests && entry.pullRequests.length > 0) {
                        console.log(
                            `Inserting ${
                                entry.pullRequests.length
                            } pull requests for entry ${index + 1}`
                        );
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
                        console.log(
                            `Inserted pull requests for entry ${index + 1}:`,
                            insertedPRs
                        );
                    }

                    console.log(
                        `Inserting ${entry.commits.length} commits for entry ${
                            index + 1
                        }`
                    );

                    const prMap = new Map(
                        insertedPRs.map((pr) => [pr.prNumber, pr.id])
                    );

                    const insertedCommits = [];
                    for (
                        let commitIndex = 0;
                        commitIndex < entry.commits.length;
                        commitIndex++
                    ) {
                        const commit = entry.commits[commitIndex];
                        const [insertedCommit] = await tx
                            .insert(commits)
                            .values({
                                hash: commit.hash,
                                message: commit.message,
                                author: commit.author,
                                date: new Date(commit.date),
                                changelogEntryId: insertedEntry.id,
                                pullRequestId: prMap.get(
                                    Number(commit.pullRequestId)
                                ),
                            })
                            .returning();
                        console.log(
                            `Inserted commit ${commitIndex + 1} for entry ${
                                index + 1
                            }:`,
                            insertedCommit
                        );
                        insertedCommits.push(insertedCommit);
                    }

                    insertedEntriesWithPRsAndCommits.push({
                        ...insertedEntry,
                        pullRequests: insertedPRs,
                        commits: insertedCommits,
                    });
                } catch (entryError) {
                    console.error(
                        `Error processing entry ${index + 1}:`,
                        entryError
                    );
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
) {
    return await db
        .select()
        .from(changelogs)
        .where(eq(changelogs.id, changelogId))
        .leftJoin(
            changelogEntries,
            eq(changelogs.id, changelogEntries.changelogId)
        )
        .leftJoin(
            pullRequests,
            eq(changelogEntries.id, pullRequests.changelogEntryId)
        )
        .leftJoin(commits, eq(changelogEntries.id, commits.changelogEntryId));
}

export async function getChangelogsByUserId(userId: string) {
    return await db
        .select()
        .from(changelogs)
        .where(eq(changelogs.userId, userId))
        .orderBy(desc(changelogs.updatedAt));
}
