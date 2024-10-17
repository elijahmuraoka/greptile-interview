import Logo from '@/components/custom/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Logo className="text-5xl sm:text-6xl p-2 border-2" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">RepLog AI</h1>
        </div>
        <p className="text-xl sm:text-2xl text-muted-foreground mt-2">
          Intelligent Changelog Automation
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <Button className="w-full sm:w-auto">
          <Link href="/dashboard">I want to make changelogs</Link>
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto">
          <Link href="/directory">I just want to browse changelogs</Link>
        </Button>
      </div>
    </div>
  );
}
