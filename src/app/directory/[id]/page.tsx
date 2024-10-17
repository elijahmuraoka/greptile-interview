'use client';

import { useEffect, useState } from 'react';
import Changelog from '@/app/dashboard/components/changelog';
import { getChangelogWithEntriesByChangelogIdAction } from '@/actions/changelogActions';
import { useSession } from 'next-auth/react';
import { ChangelogWithEntries } from '@/db/schema';
import { getUserByEmailAction } from '@/actions/userActions';

export default function ChangelogPage({ params }: { params: { id: string } }) {
    const [changelog, setChangelog] = useState<ChangelogWithEntries | null>(
        null
    );
    const [isOwner, setIsOwner] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchChangelog = async () => {
            const fetchedChangelog =
                await getChangelogWithEntriesByChangelogIdAction(params.id);
            setChangelog(fetchedChangelog);
            if (session?.user?.email) {
                const user = await getUserByEmailAction(session.user.email);
                setIsOwner(user.id === fetchedChangelog.userId);
            }
        };
        fetchChangelog();
    }, [params.id, session]);

    if (!changelog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full py-2 flex flex-col items-center justify-center">
            <Changelog
                changelog={changelog}
                isOwner={isOwner}
                inModal={false}
                onChangelogUpdate={async (updatedChangelog) => {
                    // Implement update logic here
                    // console.log('Updating changelog:', updatedChangelog);
                    setChangelog(updatedChangelog);
                }}
            />
        </div>
    );
}
