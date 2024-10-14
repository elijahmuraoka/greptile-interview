'use server';

import {
    createChangelog,
    getAllChangelogs,
    getChangelogsByUserId,
} from '@/db/queries';
import { getCommitsByRepo } from './githubActions';
import { generateChangelog } from './openAIActions';
import { auth } from '@/auth';
import { Repository } from './githubActions';
import { Changelog, NewChangelogWithEntries } from '@/db/schema';
import { getUserByEmailAction } from './userActions';

export async function getChangelogsByUserIdAction(
    userId: string
): Promise<Changelog[]> {
    return await getChangelogsByUserId(userId);
}

export async function getAllChangelogsAction() {
    return await getAllChangelogs();
}

export async function generateAndSaveChangelog(
    repository: Repository,
    timeframe: { unit: 'days' | 'months' | 'years'; value: number }
) {
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
            timeframe.value *
                (timeframe.unit === 'years'
                    ? 365
                    : timeframe.unit === 'months'
                    ? 30
                    : 1)
    );

    // Step 3: Fetch commit data
    const commitData = await getCommitsByRepo(repository, since.toISOString());

    console.log('Commit data fetched: ', commitData[0]);

    // Step 4: Generate changelog using OpenAI
    const changelogData = await generateChangelog(commitData, repository.name);

    console.log('Changelog generated: ', changelogData.entries[0]);

    // Step 5: Prepare the changelog data for saving

    const user = await getUserByEmailAction(session.user.email);

    const newChangelog: NewChangelogWithEntries = {
        ...changelogData,
        userId: user.id,
        repositoryName: repository.name,
    };

    // Step 6: Save the changelog to the database
    const savedChangelog = await createChangelog(newChangelog);
    console.log('Changelog saved');

    return savedChangelog;
}
