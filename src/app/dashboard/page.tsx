import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardGrid from './components/dashboard-grid';
import { getUserByEmailAction } from '@/actions/userActions';

export default async function Dashboard() {
  const session = await auth();
  const user = await getUserByEmailAction(session?.user?.email!);

  if (!session || !user) {
    redirect('/login');
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
