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
  const [changelogHistory, setChangelogHistory] = useState<ChangelogWithEntries[]>([]);
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
      setChangelogHistory([fetchedChangelog]);
    };
    fetchChangelog();
  }, [params.id, session]);

  if (!changelog) {
    return <Loading />;
  }

  const handleChangelogUpdate = (updatedChangelog: ChangelogWithEntries) => {
    setChangelog(updatedChangelog);
    setChangelogHistory((prev) => [...prev, updatedChangelog]);
  };

  const handleUndo = async () => {
    if (changelogHistory.length > 1) {
      const previousChangelog = changelogHistory[changelogHistory.length - 2];
      setChangelogHistory((prev) => prev.slice(0, -1));
      setChangelog(previousChangelog);
    }
  };

  return (
    <div className="w-full pt-4 flex flex-col items-center justify-center">
      <ChangelogProtection isOwner={isOwner} isPublished={changelog.isPublished} />
      <Changelog
        changelog={changelog}
        changelogHistory={changelogHistory}
        isOwner={isOwner}
        inModal={false}
        onChangelogUpdate={handleChangelogUpdate}
        onUndo={handleUndo}
      />
    </div>
  );
}
