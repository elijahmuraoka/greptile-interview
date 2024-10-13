import { db } from './index';
import { users, changelogs } from './schema';
import { eq } from 'drizzle-orm';

// Users
export async function getUserByEmail(email: string) {
    return await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);  
}

export async function createUser(data: typeof users.$inferInsert) {
    return await db.insert(users).values(data).returning();
}

// Changelogs
export async function createChangelog(data: typeof changelogs.$inferInsert) {
    return await db.insert(changelogs).values(data).returning();
}

export async function updateChangelog(
    id: string,
    data: Partial<typeof changelogs.$inferInsert>
) {
    return await db
        .update(changelogs)
        .set(data)
        .where(eq(changelogs.id, id))
        .returning();
}

export async function getChangelogsByUserId(userId: string) {
    return await db
        .select()
        .from(changelogs)
        .where(eq(changelogs.userId, userId));
}

export async function getAllChangelogs() {
    return await db.select().from(changelogs);
}
