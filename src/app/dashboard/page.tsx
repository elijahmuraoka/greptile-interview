import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export default async function Dashboard() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/');
    }

    // let user;
    // try {
    //     user = await drizzle.user.findUnique({
    //         where: { email: session.user.email! },
    //         include: { changelogs: true },
    //     });
    // } catch (error) {
    //     console.error('Failed to fetch user data:', error);
    //     return <div>Failed to load dashboard. Please try again later.</div>;
    // }

    // if (!user) {
    //     return <div>User not found.</div>;
    // }

    return (
        <div>
            <h1>Developer Dashboard</h1>
            <p>Welcome, {session.user.name || session.user.email}</p>
            <h2>Your Repositories</h2>
            {/* Add repository management here */}
            <h2>Your Changelogs</h2>
            {/* {user.changelogs.length > 0 ? (
                <ul>
                    {user.changelogs.map((changelog) => (
                        <li key={changelog.id}>
                            {changelog.title}
                            <Link href={`/edit-changelog/${changelog.id}`}>
                                Edit
                            </Link>
                            <Link href={`/changelog/${changelog.id}`}>
                                View Public
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't created any changelogs yet.</p>
            )} */}
            <Link href="/generate-changelog">Create a new changelog</Link>
        </div>
    );
}
