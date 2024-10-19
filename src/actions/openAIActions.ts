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

  if (commitData.length === 0) {
    throw new Error('No recent repository activity found in the selected timeframe.');
  }

  const prompt = `Create a professional human-readable changelog for the repository "${repositoryName}" using the following commit data:

${commitData
  .map(
    (commit) => `
- Commit: ${commit.hash}
  Message: ${commit.message}
  Author: ${commit.author}
  Date: ${commit.date}
  Additions: ${commit.additions}, Deletions: ${commit.deletions}
  ${
    commit.pullRequest
      ? `Pull Request: #${commit.pullRequest.number} - ${commit.pullRequest.title}
  URL: ${commit.pullRequest.url}
  Labels: ${commit.pullRequest.labels.join(', ')}`
      : 'No associated pull request'
  }
`
  )
  .join('\n')}

Provide a JSON response with:
{
  "title": "Changelog for ${repositoryName}",
  "summary": "Briefly summarize key changes and their impact.",
  "entries": [
    {
      "message": "Description of the change",
      "date": "Change date in ISO format",
      "tags": ["feature", "bugfix", etc.],
      "impact": "How this change affects users or developers",
      "technicalDetails": "Optional technical information, useful for developers, but don't include any specific code references. Leave blank if not applicable.",
      "userBenefit": "Benefits for end-users",
      "breakingChange": true/false,
      "pullRequests": [
        {
          "prNumber": 123,
          "title": "PR title",
          "url": "PR URL"
        }
      ],
      "commits": [
        {
          "hash": "Commit hash",
          "message": "Commit message",
          "author": "Commit author",
          "date": "Commit date",
          "pullRequestId": null or PR number
        }
      ],
    }
  ]
}

Guidelines:
1. Use only the provided git data.
2. Group related commits logically into entries.
3. Write clear, concise descriptions for all audiences.
4. Highlight new features, enhancements, and breaking changes.
5. Explain breaking changes and required user actions.
6. Include technical details for developers and benefits for end-users.
7. Combine related commits and pull requests into single entries.
8. Categorize entries with appropriate tags.
9. Ensure correct association of commits with pull requests.
10. Mention specific issues or feature requests if applicable.

The goal is to create an accurate, valuable changelog for developers and end-users.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert assistant specialized in generating detailed and professional changelogs in JSON format. Your task is to accurately reflect the provided commit data without inventing or assuming any information. Focus on clarity, precision, and utility for both developers and end-users. Output the JSON data directly without any markdown or additional formatting.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log('Initial openai generated content: ', content);

    const changelogContent: NewChangelogWithEntries = JSON.parse(content);
    return changelogContent;
  } catch (error) {
    console.error('Error generating changelog:', error);
    throw error;
  }
}
