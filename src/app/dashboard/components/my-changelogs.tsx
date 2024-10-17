import { Changelog } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MyChangelogsProps {
  changelogs: Changelog[];
}

export default function MyChangelogs({ changelogs }: MyChangelogsProps) {
  if (changelogs.length === 0) {
    return <div>No changelogs found, click &quot;Generate New Changelog&quot; to get started!</div>;
  }

  return (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
      {changelogs.map((changelog, index) => (
        <Card key={changelog.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {index + 1}. {changelog.title}
            </CardTitle>
            <Link href={`/directory/${changelog.id}`} passHref>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{changelog.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
