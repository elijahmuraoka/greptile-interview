'use server';

import { createUser, getUserByEmail } from '@/db/queries';
import { users } from '@/db/schema';

export async function getUserByEmailAction(email: string) {
  return (await getUserByEmail(email))[0];
}

export async function createUserAction(data: typeof users.$inferInsert) {
  return (await createUser(data))[0];
}
