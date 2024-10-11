import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { Octokit } from '@octokit/rest';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const repo = searchParams.get('repo');

        if (!repo) {
            return NextResponse.json(
                { error: 'Repository not specified' },
                { status: 400 }
            );
        }

        const octokit = new Octokit({ auth: session.accessToken });

        const [owner, repoName] = repo.split('/');
        const { data: commits } = await octokit.repos.listCommits({
            owner,
            repo: repoName,
            per_page: 10,
        });

        return NextResponse.json({ commits });
    } catch (error) {
        console.error('Error fetching commits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch commits' },
            { status: 500 }
        );
    }
}
