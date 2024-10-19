import { ChangelogWithEntries } from '@/db/schema';

export const fakeChangelog: ChangelogWithEntries = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Release v1.5.0',
  summary: 'This release includes several new features, performance improvements, and bug fixes.',
  createdAt: new Date('2023-05-15T10:00:00Z'),
  updatedAt: new Date('2023-05-15T10:00:00Z'),
  userId: '98765432-e89b-12d3-a456-426614174000',
  repositoryName: 'my-awesome-project',
  isPublished: true,
  entries: [
    {
      id: 'abcdef12-3456-7890-abcd-ef1234567890',
      changelogId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Add dark mode support',
      date: new Date('2023-05-10T14:30:00Z'),
      tags: ['feature', 'enhancement'],
      impact:
        'Users can now switch between light and dark themes for better viewing experience in different lighting conditions.',
      technicalDetails: 'Implemented using CSS variables and a theme toggle component.',
      userBenefit: 'Improved readability and reduced eye strain in low-light environments.',
      breakingChange: false,
      pullRequests: [
        {
          id: 'pr123456',
          prNumber: 42,
          title: 'Implement dark mode',
          url: 'https://github.com/my-org/my-awesome-project/pull/42',
          changelogEntryId: 'abcdef12-3456-7890-abcd-ef1234567890',
        },
      ],
      commits: [
        {
          id: 'commit123',
          hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          message: 'Add dark mode toggle and styles',
          author: 'Jane Doe',
          date: new Date('2023-05-10T14:30:00Z'),
          changelogEntryId: 'abcdef12-3456-7890-abcd-ef1234567890',
          pullRequestId: 'pr123456',
        },
      ],
    },
    {
      id: 'fedcba98-7654-3210-fedc-ba9876543210',
      changelogId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Optimize database queries for better performance',
      date: new Date('2023-05-12T09:15:00Z'),
      tags: ['performance', 'enhancement'],
      impact: 'Significantly reduced load times for data-heavy pages.',
      technicalDetails: 'Implemented database indexing and query caching.',
      userBenefit: 'Faster page loads and improved overall application responsiveness.',
      breakingChange: false,
      pullRequests: [
        {
          id: 'pr789012',
          prNumber: 43,
          title: 'Optimize DB queries',
          url: 'https://github.com/my-org/my-awesome-project/pull/43',
          changelogEntryId: 'fedcba98-7654-3210-fedc-ba9876543210',
        },
      ],
      commits: [
        {
          id: 'commit456',
          hash: 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6',
          message: 'Add indexes to frequently queried columns',
          author: 'John Smith',
          date: new Date('2023-05-12T09:15:00Z'),
          changelogEntryId: 'fedcba98-7654-3210-fedc-ba9876543210',
          pullRequestId: 'pr789012',
        },
      ],
    },
    {
      id: '11111111-2222-3333-4444-555555555555',
      changelogId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Update authentication system',
      date: new Date('2023-05-14T11:45:00Z'),
      tags: ['security', 'breaking'],
      impact: 'Improved security measures for user authentication.',
      technicalDetails: 'Switched to JWT-based authentication and implemented refresh tokens.',
      userBenefit:
        'Enhanced account security and longer session durations without compromising safety.',
      breakingChange: true,
      pullRequests: [
        {
          id: 'pr345678',
          prNumber: 44,
          title: 'Implement new auth system',
          url: 'https://github.com/my-org/my-awesome-project/pull/44',
          changelogEntryId: '11111111-2222-3333-4444-555555555555',
        },
      ],
      commits: [
        {
          id: 'commit789',
          hash: 'z9x8c7v6b5n4m3l2k1j0h9g8f7d6s5a4',
          message: 'Implement JWT authentication',
          author: 'Alice Johnson',
          date: new Date('2023-05-14T11:45:00Z'),
          changelogEntryId: '11111111-2222-3333-4444-555555555555',
          pullRequestId: 'pr345678',
        },
      ],
    },
  ],
};
