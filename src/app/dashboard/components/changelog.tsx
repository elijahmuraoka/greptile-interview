'use client';

import { ChangelogWithEntries } from '@/db/schema';

interface ChangelogProps {
    changelog: ChangelogWithEntries | null;
}

const fakePullRequests = [
    {
        prNumber: 1,
        title: 'Fix bug',
        url: 'https://github.com/org/repo/pull/1',
    },
];

export default function Changelog({ changelog }: ChangelogProps) {
    return (
        <ul className="space-y-4 h-[70vh] md:h-[50vh] overflow-y-auto">
            {changelog?.entries.map((entry) => (
                <li
                    key={entry.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            {entry.message}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {entry.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {entry.impact && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Impact: {entry.impact}
                            </p>
                        )}
                        {entry.breakingChange && (
                            <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                Breaking Change
                            </p>
                        )}
                    </div>
                    {fakePullRequests && (
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Associated Pull Requests:
                            </h4>
                            <ul className="space-y-1">
                                {fakePullRequests.map((pr) => (
                                    <li key={pr.prNumber}>
                                        <a
                                            href={pr.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            #{pr.prNumber} - {pr.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}
