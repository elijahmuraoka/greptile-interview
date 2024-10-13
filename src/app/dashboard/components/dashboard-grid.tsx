'use client';

import { useState, useEffect } from 'react';
import { changelogs } from '@/db/schema';
import { getChangelogsByUserIdAction } from '@/actions/changelogActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardGridProps {
    userId: string;
}

export default function DashboardGrid({ userId }: DashboardGridProps) {
    const [userChangelogs, setUserChangelogs] = useState<
        (typeof changelogs.$inferSelect)[]
    >([]);

    useEffect(() => {
        const fetchAndSetChangelogs = async () => {
            try {
                setUserChangelogs(await getChangelogsByUserIdAction(userId));
            } catch (error) {
                console.error('Error fetching changelogs: ', error);
            }
        };

        fetchAndSetChangelogs();
    }, [userId]);

    const lastUpdatedChangelog = userChangelogs.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0];
    const lastUpdatedChangelogTitle = lastUpdatedChangelog?.title ?? 'N/A';
    const lastUpdate =
        lastUpdatedChangelog?.updatedAt.toLocaleDateString() ?? 'N/A';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex justify-between w-full">
                        <span>Total Changelogs:</span>
                        <span className="font-semibold">
                            {userChangelogs.length}
                        </span>
                    </div>
                    <div className="flex justify-between w-full">
                        <span>View Recent Changelog: </span>
                        <Link
                            href={`/changelog/${lastUpdatedChangelog?.id}`}
                            className="font-semibold"
                        >
                            {lastUpdatedChangelogTitle}
                        </Link>
                    </div>
                    <div className="flex justify-between w-full">
                        <span>Last Update: </span>
                        <span className="font-semibold">{lastUpdate}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button>Generate New Changelog</Button>
                    <Button variant="outline" asChild>
                        <Link href="/directory">View Public Directory</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>My Changelogs</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Add your content here */}
                    <p>This card spans the full width of the grid.</p>
                </CardContent>
            </Card>
        </div>
    );
}
