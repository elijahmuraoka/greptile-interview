import { NewChangelogWithEntries } from '@/db/schema';
import { OpenAI } from 'openai';
import { CommitData } from './githubActions';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChangelog(
    commitData: CommitData[],
    repositoryName: string
): Promise<NewChangelogWithEntries> {
    console.log('Generating changelog using OpenAI');

    const prompt = `Generate a detailed, professional changelog for the repository "${repositoryName}" based on the following commit information:

${commitData
    .map(
        (commit) => `
- Commit: ${commit.hash}
  Message: ${commit.message}
  Author: ${commit.author}
  Date: ${commit.date}
  Files changed: ${commit.files.join(', ')}
  Additions: ${commit.additions}, Deletions: ${commit.deletions}
  ${
      commit.pullRequest
          ? `Pull Request: #${commit.pullRequest.number} - ${
                commit.pullRequest.title
            }
  URL: ${commit.pullRequest.url}
  Labels: ${commit.pullRequest.labels.join(', ')}`
          : 'No associated pull request'
  }
`
    )
    .join('\n')}

Please provide a JSON response with the following structure:
{
  "title": "Changelog for ${repositoryName}",
  "summary": "A comprehensive summary of the overall changes, highlighting major features, improvements, and any breaking changes",
  "entries": [
    {
      "message": "A clear, concise description of the change that both developers and end-users can understand",
      "tags": ["One or more tags from: feature, enhancement, bugfix, performance, documentation, refactor, test, chore, security, breaking"],
      "impact": "A detailed explanation of how this change affects users or developers, including any action required",
      "technicalDetails": "Optional field for more in-depth technical information, useful for developers",
      "userBenefit": "Explanation of how this change benefits end-users in non-technical terms",
      "breakingChange": true/false,
      "pullRequests": [
        {
          "prNumber": 123,
          "title": "Title of the PR",
          "url": "URL of the PR"
        }
      ],
      "commits": [
        {
          "hash": "Commit hash",
          "message": "Commit message",
          "author": "Commit author",
          "date": "Commit date",
          "pullRequestId": null  // This should be null if not associated with a PR, or the PR's number if it is
        }
      ],
    }
  ]
}

When generating the changelog, please follow these guidelines:
1. Organize commits into logical, coherent groups. Each entry should represent a significant change, feature, or fix.
2. Provide clear, concise descriptions that are understandable to both technical and non-technical audiences.
3. Use professional language and maintain a consistent tone throughout the changelog.
4. Highlight important changes, especially new features, major enhancements, and breaking changes.
5. For breaking changes, clearly explain what has changed and what actions users need to take.
6. Include relevant technical details for developers, but also explain the impact and benefits for end-users.
7. If multiple commits or pull requests relate to the same change, combine them into a single, comprehensive entry.
8. Use the tags to categorize each entry appropriately. You can use multiple tags if applicable.
9. In the 'impact' field, focus on the practical implications of the change.
10. Ensure that commits are correctly associated with their pull requests if applicable.
11. If a change addresses a specific issue or feature request, mention it in the message (e.g., "Fixes #123").
12. For significant changes, use the 'technicalDetails' field to provide more in-depth information for developers.
13. Use the 'userBenefit' field to explain how each change improves the product for end-users in non-technical terms.
14. Only include the 'pullRequests' array if there are actual pull requests associated with the entry. If there are no pull requests, omit this field entirely rather than including null values.
15. Ensure that all fields in the pullRequests and commits objects have valid values. Do not include null values for prNumber, title, or url in pullRequests.

The goal is to create a changelog that serves as a valuable resource for both developers and end-users, providing a clear overview of the project's evolution.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that generates detailed and professional changelogs in JSON format.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message?.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const changelogContent: NewChangelogWithEntries = JSON.parse(content);
        return changelogContent;
    } catch (error) {
        console.error('Error generating changelog:', error);
        throw error;
    }
}
