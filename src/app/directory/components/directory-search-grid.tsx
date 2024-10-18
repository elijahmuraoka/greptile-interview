'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { ChangelogWithUser } from '@/db/schema';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

interface DirectorySearchGridProps {
  changelogs: ChangelogWithUser[];
}

export default function DirectorySearchGrid({ changelogs }: DirectorySearchGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();

  useEffect(() => {}, [debouncedSearchTerm, toast]);

  const filteredChangelogs = changelogs.filter(
    (changelog) =>
      (changelog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        changelog.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) &&
      changelog.isPublished
  );

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      {/* Directory Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="search"
          placeholder="Search changelogs..."
          className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-gray-300 focus:border-blue-600 focus-visible:ring-0 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Directory Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
        {filteredChangelogs.length > 0 ? (
          filteredChangelogs.map((changelog) => (
            <Card
              className="hover:shadow-md hover:border-gray-400 transition-all duration-200 ease-in-out space-y-0"
              key={changelog.id}
            >
              <CardHeader className="p-y-0">
                <CardTitle className="text-lg font-semibold">{changelog.title}</CardTitle>
                <CardDescription>
                  <p className="text-xs text-muted-foreground">
                    {changelog.summary.length > 150
                      ? `${changelog.summary.slice(0, 150)}...`
                      : changelog.summary}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start justify-center gap-2 text-foreground/80">
                <span className="text-sm">
                  Last updated:{' '}
                  <span className="font-semibold">{changelog?.updatedAt.toLocaleDateString()}</span>
                </span>
                <span className="text-sm ">
                  Created by:{' '}
                  <span className="font-semibold">
                    {changelog?.user?.name || changelog?.user?.email}
                  </span>
                </span>
              </CardContent>
              <CardFooter className="justify-end items-end">
                <Link href={`/directory/${changelog.id}`} key={changelog.id}>
                  <Button variant="outline">View Changelog</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-full">
            <p className="text-lg text-muted-foreground">No changelogs found. 👎</p>
          </div>
        )}
      </div>
    </div>
  );
}
