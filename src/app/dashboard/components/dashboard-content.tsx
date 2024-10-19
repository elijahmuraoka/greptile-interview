'use client';

import { useState, useEffect } from 'react';
import { getUserByIdAction } from '@/actions/userActions';
import { User } from '@/db/schema';
import DashboardGrid from './dashboard-grid';
import Loading from '@/app/loading';

interface DashboardContentProps {
  userId: string;
}

export default function DashboardContent({ userId }: DashboardContentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserByIdAction(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
          setLoading(false);
        } else {
          setTimeout(fetchUser, 1000);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setTimeout(fetchUser, 1000);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full flex-1 flex flex-col gap-8 pt-12 px-8 items-center">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Welcome back, {user.name}!</h1>
        <h3 className="text-lg font-medium text-muted-foreground">
          Here you can create new changelogs, manage your existing ones, and view analytics.
        </h3>
      </div>
      <DashboardGrid userId={user.id} />
    </div>
  );
}
