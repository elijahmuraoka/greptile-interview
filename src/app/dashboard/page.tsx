import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardContent from './components/dashboard-content';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <DashboardContent userId={session.user.id} />;
}
