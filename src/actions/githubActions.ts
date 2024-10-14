'use server';

import { auth } from '@/auth';
import { Octokit } from '@octokit/rest';

export type Repository = Awaited<ReturnType<typeof getRepositories>>[number];

export interface CommitData {
    hash: string;
    message: string;
    author: string;
    date: string;
    files: string[];
    additions: number;
    deletions: number;
    pullRequest: {
        number: number;
        title: string;
        url: string;
        labels: string[];
    } | null;
}

export async function getGithubUser() {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error('User is not authenticated or missing access token.');
    }

    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${session.accessToken}`,
            },
        });
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function getRepositories() {
    const session = await auth();

    if (!session) {
        throw new Error('User is not authenticated.');
    }

    try {
        const octokit = new Octokit({ auth: session.accessToken });
        let page = 1;
        let allRepositories: any[] = [];

        while (true) {
            const { data: repositories } =
                await octokit.rest.repos.listForAuthenticatedUser({
                    visibility: 'all',
                    sort: 'updated',
                    direction: 'desc',
                    per_page: 100,
                    page: page,
                });

            const filteredRepositories = repositories.filter((repo) => {
                return (
                    !repo.fork ||
                    (repo.fork && repo.owner.login === session.user?.name)
                );
            });

            allRepositories = allRepositories.concat(filteredRepositories);

            if (repositories.length < 100) break; // No more pages
            page++;
        }

        return allRepositories;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

export async function getCommitsByRepo(
    repository: Repository,
    since?: string
): Promise<CommitData[]> {
    console.log('Getting commits by repo');

    const session = await auth();

    if (!session?.accessToken) {
        throw new Error('User is not authenticated or missing access token.');
    }

    try {
        const octokit = new Octokit({ auth: session.accessToken });
        const { data: commits } = await octokit.rest.repos.listCommits({
            owner: repository.owner.login,
            repo: repository.name,
            since: since, // ISO 8601 formatted date
            per_page: 100, // Adjust as needed
        });

        const commitData = await Promise.all(
            commits.map(async (commit): Promise<CommitData> => {
                const { data: details } = await octokit.rest.repos.getCommit({
                    owner: repository.owner.login,
                    repo: repository.name,
                    ref: commit.sha,
                });

                const { data: prs } =
                    await octokit.rest.repos.listPullRequestsAssociatedWithCommit(
                        {
                            owner: repository.owner.login,
                            repo: repository.name,
                            commit_sha: commit.sha,
                        }
                    );

                return {
                    hash: commit.sha,
                    message: commit.commit.message,
                    author: commit.commit.author?.name || 'Unknown',
                    date:
                        commit.commit.author?.date || new Date().toISOString(),
                    files: details.files?.map((file) => file.filename) || [],
                    additions: details.stats?.additions || 0,
                    deletions: details.stats?.deletions || 0,
                    pullRequest: prs[0]
                        ? {
                              number: prs[0].number,
                              title: prs[0].title,
                              url: prs[0].html_url,
                              labels: prs[0].labels.map((label) => label.name),
                          }
                        : null,
                };
            })
        );

        return commitData;
    } catch (error) {
        console.error('Error fetching commits for changelog:', error);
        throw error;
    }
}
