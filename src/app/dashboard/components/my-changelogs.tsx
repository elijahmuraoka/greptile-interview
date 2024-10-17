'use client';

import { Changelog } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteChangelogAction } from '@/actions/changelogActions';
import { useToast } from '@/hooks/use-toast';

interface MyChangelogsProps {
  changelogs: Changelog[];
  triggerUpdate: () => void;
}

export default function MyChangelogs({ changelogs, triggerUpdate }: MyChangelogsProps) {
  const { toast } = useToast();

  if (changelogs.length === 0) {
    return <div>No changelogs found, click &quot;Generate New Changelog&quot; to get started!</div>;
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this changelog?')) {
      try {
        await deleteChangelogAction(id);
        triggerUpdate();
        toast({
          description: 'The changelog has been successfully deleted.',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error deleting changelog: ', error);
        toast({
          description: 'There was an error deleting the changelog.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
      {changelogs.map((changelog, index) => (
        <Card key={changelog.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {index + 1}. {changelog.title}
            </CardTitle>
            <div className="flex space-x-2">
              <Link href={`/directory/${changelog.id}`} passHref>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(changelog.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{changelog.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
