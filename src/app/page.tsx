import { auth } from '@/auth';
import Logo from '@/components/custom/logo';
import { Button } from '@/components/ui/button';

export default async function Home() {
    return (
        <div className="flex w-full min-h-screen flex-col items-center justify-center bg-gradient-to-r gap-12">
            <div className="flex flex-row items-center justify-center gap-4">
                <Logo className="text-8xl p-2.5" />
                <h1 className="text-7xl font-bold">RepoLog AI</h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
                <Button>I want to make changelogs</Button>
                <Button variant="ghost">
                    I just want to browse changelogs
                </Button>
            </div>
        </div>
    );
}
