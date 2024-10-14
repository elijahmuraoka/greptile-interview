'use client';

import { ChangelogWithEntries } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface ChangelogProps {
    changelog: ChangelogWithEntries | null;
}

export default function Changelog({ changelog }: ChangelogProps) {
    if (!changelog) {
        return null;
    }

    return (
        <ScrollArea className="h-[70vh] md:h-[50vh]">
            <div className="space-y-4 p-4">
                {changelog?.entries.map((entry) => (
                    <Card key={entry.id}>
                        <CardHeader className="flex flex-col space-y-2 mb-[-5px]">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    {entry.message}
                                </CardTitle>
                                {entry.breakingChange && (
                                    <Badge variant="destructive">
                                        Breaking Change
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {entry.tags?.map((tag, index) => (
                                    <Badge key={index} variant="tag">
                                        {tag.charAt(0).toUpperCase() +
                                            tag.slice(1)}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <Separator className="w-[95%] mx-auto" />
                        <CardContent className="pt-4">
                            <div className="space-y-2">
                                {entry.impact && (
                                    <p className="text-sm">
                                        <span className="font-semibold">
                                            Impact:
                                        </span>{' '}
                                        {entry.impact}
                                    </p>
                                )}
                                {entry.technicalDetails && (
                                    <p className="text-sm">
                                        <span className="font-semibold">
                                            Technical Details:
                                        </span>{' '}
                                        {entry.technicalDetails}
                                    </p>
                                )}
                                {entry.userBenefit && (
                                    <p className="text-sm">
                                        <span className="font-semibold">
                                            User Benefit:
                                        </span>{' '}
                                        {entry.userBenefit}
                                    </p>
                                )}
                                {entry.pullRequests &&
                                    entry.pullRequests.length > 0 && (
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="pull-requests">
                                                <AccordionTrigger>
                                                    Associated Pull Requests
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {entry.pullRequests.map(
                                                            (pr) => (
                                                                <li
                                                                    key={pr.id}
                                                                    className="flex items-center"
                                                                >
                                                                    <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                    <a
                                                                        href={
                                                                            pr.url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    >
                                                                        #
                                                                        {
                                                                            pr.prNumber
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            pr.title
                                                                        }
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
}
