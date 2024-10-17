'use client';

import { useState, useEffect } from 'react';
import { Changelog } from '@/db/schema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getChangelogsByUserIdAction } from '@/actions/changelogActions';
import GenerateChangelogModal from './generate-changelog-modal';
import MyChangelogs from './my-changelogs';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardGridProps {
  userId: string;
}

export default function DashboardGrid({ userId }: DashboardGridProps) {
  const [userChangelogs, setUserChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const changelogs = await getChangelogsByUserIdAction(userId);
        setUserChangelogs(changelogs);
      } catch (error) {
        console.error('Error fetching changelogs: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChangelogs();
  }, [userId, updateTrigger]);

  const lastUpdatedChangelog = userChangelogs[0];
  const lastUpdatedChangelogTitle = lastUpdatedChangelog?.title ?? 'N/A';
  const lastUpdate = lastUpdatedChangelog?.updatedAt.toLocaleDateString() ?? 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between w-full">
            <span>Total Changelogs:</span>
            <span className="font-semibold">
              {isLoading ? <Skeleton className="w-8 h-6" /> : userChangelogs.length}
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span>View Recent Changelog: </span>
            <span className="font-semibold">
              {isLoading ? (
                <Skeleton className="w-24 h-6" />
              ) : (
                <Link href={`/changelog/${lastUpdatedChangelog?.id}`}>
                  {lastUpdatedChangelogTitle}
                </Link>
              )}
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span>Last Update: </span>
            <span className="font-semibold">
              {isLoading ? <Skeleton className="w-24 h-6" /> : lastUpdate}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <GenerateChangelogModal onChangelogGenerated={triggerUpdate} />
          <Button variant="outline" asChild className="w-full">
            <Link href="/directory">View Public Directory</Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>My Changelogs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <MyChangelogs changelogs={userChangelogs} triggerUpdate={triggerUpdate} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
