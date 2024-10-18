'use server';

import {
  createChangelog,
  getAllChangelogs,
  getChangelogsByUserId,
  getChangelogWithEntriesByChangelogId,
  deleteChangelog,
  updateChangelog,
} from '@/db/queries';
import { getCommitsByRepo } from './githubActions';
import { generateChangelog } from './openAIActions';
import { auth } from '@/auth';
import { Repository } from './githubActions';
import { Changelog, ChangelogWithEntries, NewChangelogWithEntries } from '@/db/schema';
import { getUserByEmailAction } from './userActions';

export async function getChangelogsByUserIdAction(userId: string): Promise<Changelog[]> {
  return await getChangelogsByUserId(userId);
}

export async function getChangelogWithEntriesByChangelogIdAction(
  id: string
): Promise<ChangelogWithEntries> {
  const result = await getChangelogWithEntriesByChangelogId(id);
  if (!result) {
    throw new Error('Changelog not found!');
  }
  return result;
}

export async function getAllChangelogsAction() {
  return await getAllChangelogs();
}

export async function deleteChangelogAction(id: string) {
  console.log('Deleting changelog with id: ', id);
  return await deleteChangelog(id);
}

export async function updateChangelogAction(id: string, changelog: ChangelogWithEntries) {
  return await updateChangelog(id, changelog);
}

export async function generateAndSaveChangelog(
  repository: Repository,
  timeframe: { unit: 'days' | 'months' | 'years'; value: number }
) {
  try {
    // Step 1: Authenticate user
    console.log('Authenticating user');
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    console.log('User authenticated');

    // Step 2: Calculate the 'since' date based on the timeframe
    const since = new Date();
    since.setDate(
      since.getDate() -
        timeframe.value * (timeframe.unit === 'years' ? 365 : timeframe.unit === 'months' ? 30 : 1)
    );

    // Step 3: Fetch commit data
    const commitData = await getCommitsByRepo(repository, since.toISOString());

    console.log('Commit data fetched: ', commitData);

    // Step 4: Generate changelog using OpenAI
    const changelogData = await generateChangelog(commitData, repository.name);

    // Step 5: Prepare the changelog data for saving

    const user = await getUserByEmailAction(session.user.email);

    const newChangelog: NewChangelogWithEntries = {
      ...changelogData,
      userId: user.id,
      repositoryName: repository.name,
    };

    // Step 6: Save the changelog to the database
    const savedChangelog = await createChangelog(newChangelog);
    console.log('Changelog saved to database');

    return savedChangelog;
  } catch (error) {
    console.error('Error generating changelog: ', error);
    throw error;
  }
}
