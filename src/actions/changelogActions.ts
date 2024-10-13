'use server';

import { createChangelog, getChangelogsByUserId, getAllChangelogs } from '@/db/queries';
import { changelogs } from '@/db/schema';

// make all changelog next js actions here
export async function createChangeLogAction(data: typeof changelogs.$inferInsert) {
    return await createChangelog(data);
}

export async function getChangelogsByUserIdAction(userId: string) {
    return await getChangelogsByUserId(userId);
}

export async function getAllChangelogsAction() {
    return await getAllChangelogs();
}