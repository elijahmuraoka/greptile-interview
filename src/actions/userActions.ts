'use server';

import { createUser, getUserById, getUserByUsername } from '@/db/queries';
import { users } from '@/db/schema';

export async function getUserByUsernameAction(username: string) {
  return (await getUserByUsername(username))[0];
}

export async function getUserByIdAction(id: string) {
  return (await getUserById(id))[0];
}

export async function createUserAction(data: typeof users.$inferInsert) {
  return (await createUser(data))[0];
}
