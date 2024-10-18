'use client';

import { useEffect, useState } from 'react';
import Changelog from '@/app/dashboard/components/changelog';
import { getChangelogWithEntriesByChangelogIdAction } from '@/actions/changelogActions';
import { useSession } from 'next-auth/react';
import { ChangelogWithEntries } from '@/db/schema';
import { getUserByEmailAction } from '@/actions/userActions';
import Loading from '@/app/loading';
import ChangelogProtection from './changelog-protection';

export default function ChangelogPage({ params }: { params: { id: string } }) {
  const [changelog, setChangelog] = useState<ChangelogWithEntries | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchChangelog = async () => {
      const fetchedChangelog = await getChangelogWithEntriesByChangelogIdAction(params.id);
      if (session?.user?.email) {
        const user = await getUserByEmailAction(session.user.email);
        setIsOwner(user.id == fetchedChangelog.userId);
      }
      setChangelog(fetchedChangelog);
    };
    fetchChangelog();
  }, [params.id, session]);

  if (!changelog) {
    return <Loading />;
  }

  return (
    <div className="w-full pt-4 flex flex-col items-center justify-center">
      <ChangelogProtection isOwner={isOwner} isPublished={changelog.isPublished} />
      <Changelog
        changelog={changelog}
        isOwner={isOwner}
        inModal={false}
        onChangelogUpdate={async (updatedChangelog) => {
          setChangelog(updatedChangelog);
        }}
      />
    </div>
  );
}
