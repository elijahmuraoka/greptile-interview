'use client';

import { useState, useEffect } from 'react';
import {
    ChangelogWithEntries,
    ChangelogEntry,
    PullRequest,
    ChangelogEntryWithPRsAndCommits,
} from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trash2, Plus, Undo2, Edit, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ChangelogProps {
    changelog: ChangelogWithEntries;
    isOwner: boolean;
    inModal?: boolean;
    onChangelogUpdate: (updatedChangelog: ChangelogWithEntries) => void;
}

export default function Changelog({
    changelog,
    isOwner,
    inModal,
    onChangelogUpdate,
}: ChangelogProps) {
    const [changelogHistory, setChangelogHistory] = useState<
        ChangelogWithEntries[]
    >([changelog]);
    const [isEditing, setIsEditing] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        setChangelogHistory([changelog]);
    }, [changelog]);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    // Changelog Update Handlers

    const handleUpdate = (updatedChangelog: ChangelogWithEntries) => {
        onChangelogUpdate(updatedChangelog);
        setChangelogHistory((prev) => [...prev, updatedChangelog]);
    };

    const handleAddEntry = () => {
        const newEntry: ChangelogEntryWithPRsAndCommits = {
            id: Date.now().toString(),
            changelogId: changelog.id,
            message: '',
            tags: [],
            impact: null,
            technicalDetails: null,
            userBenefit: null,
            breakingChange: false,
            pullRequests: [],
            commits: [],
        };
        handleUpdate({
            ...changelog,
            entries: [...changelog.entries, newEntry],
        });
    };

    const handleRemoveEntry = (index: number) => {
        const updatedEntries = changelog.entries.filter((_, i) => i !== index);
        handleUpdate({ ...changelog, entries: updatedEntries });
    };

    const handleEntryUpdate = (
        entryIndex: number,
        updatedEntry: Partial<ChangelogEntryWithPRsAndCommits>
    ) => {
        handleUpdate({
            ...changelog,
            entries: changelog.entries.map((e, i) =>
                i === entryIndex ? { ...e, ...updatedEntry } : e
            ),
        });
    };

    const handleUpdatePublished = () => {
        const published = !changelog.isPublished;
        if (published) {
            toast({
                description:
                    'Your changelog has been published and is now visible to the public.',
                variant: 'success',
            });
        } else {
            toast({
                description:
                    'Your changelog has been unpublished and is now hidden from the public.',
                variant: 'success',
            });
        }
        handleUpdate({ ...changelog, isPublished: published });
    };

    // Entry Field Handlers

    const handleUpdateBreakingChange = (
        entryIndex: number,
        breakingChange: boolean
    ) => {
        handleEntryUpdate(entryIndex, { breakingChange });
    };

    const handleAddTag = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        const tag = e.currentTarget.value;
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tag && !changelog.entries[index].tags?.includes(tag)) {
                handleEntryUpdate(index, {
                    tags: [...(changelog.entries[index].tags || []), tag],
                });
                e.currentTarget.value = '';
            }
        }
    };

    const handleRemoveTag = (entryIndex: number, tagIndex: number) => {
        const updatedTags = changelog.entries[entryIndex].tags?.filter(
            (_, i) => i !== tagIndex
        );
        handleEntryUpdate(entryIndex, { tags: updatedTags });
    };

    const handleAddPullRequest = (entryIndex: number) => {
        const newPR: PullRequest = {
            id: Date.now().toString(),
            prNumber: 0,
            title: '',
            url: '',
            changelogEntryId: changelog.entries[entryIndex].id,
        };
        const updatedEntry = {
            ...changelog.entries[entryIndex],
            pullRequests: [
                ...(changelog.entries[entryIndex].pullRequests || []),
                newPR,
            ],
        };
        handleEntryUpdate(entryIndex, updatedEntry);
    };

    const handleUpdatePullRequest = (
        entryIndex: number,
        prIndex: number,
        updatedPR: Partial<PullRequest>
    ) => {
        const updatedPRs = changelog.entries[entryIndex].pullRequests?.map(
            (pr, i) => (i === prIndex ? { ...pr, ...updatedPR } : pr)
        );
        handleEntryUpdate(entryIndex, { pullRequests: updatedPRs });
    };

    const handleRemovePullRequest = (entryIndex: number, prIndex: number) => {
        const updatedPRs = changelog.entries[entryIndex].pullRequests?.filter(
            (_, i) => i !== prIndex
        );
        handleEntryUpdate(entryIndex, { pullRequests: updatedPRs });
    };

    const handleUndo = () => {
        // if (changelogHistory.length > 1) {
        //     const previousChangelog = changelogHistory[changelogHistory.length - 2];
        //     setEditedChangelog(previousChangelog);
        //     setChangelogHistory(prev => prev.slice(0, -1));
        //     onChangelogUpdate?.(previousChangelog);
        // }
    };

    return (
        <div
            className={`${
                !inModal ? 'w-[90vw]' : 'w-full'
            } flex flex-col gap-4 bg-transparent`}
        >
            {/* Navbar - [Undo, Title, Edit] + Summary */}
            <div
                className={`${
                    !inModal ? 'sticky top-16' : ''
                } flex flex-col text-card-foreground border-b border-border shadow-b-2 z-10 w-full p-4 gap-4 bg-background shadow-[0px_4px_4px_-1px_rgba(0,0,0,0.2)]`}
            >
                <div
                    className={`${
                        isOwner ? 'justify-between' : 'justify-center'
                    } flex items-center w-full text-center`}
                >
                    {isOwner && (
                        <Button
                            variant="outline"
                            onClick={handleUndo}
                            disabled={changelogHistory.length <= 1}
                        >
                            <Undo2 className="w-4 h-4 mr-2" /> Undo
                        </Button>
                    )}
                    <div className="w-1/2 text-2xl font-bold max-w-screen-lg mx-auto">
                        {isEditing ? (
                            <Input
                                value={changelog.title}
                                onChange={(e) =>
                                    handleUpdate({
                                        ...changelog,
                                        title: e.target.value,
                                    })
                                }
                                className="text-xl"
                                placeholder="Changelog Title"
                            />
                        ) : (
                            <h2>{changelog.title}</h2>
                        )}
                    </div>
                    {isOwner && (
                        <Button variant="outline" onClick={toggleEditing}>
                            <Edit className="w-4 h-4 mr-2" />
                            {isEditing ? 'View' : 'Edit'}
                        </Button>
                    )}
                </div>
                {/* Summary */}
                <div className="w-full text-sm text-muted-foreground text-center max-w-screen-lg mx-auto">
                    {isEditing ? (
                        <Textarea
                            value={changelog.summary}
                            onChange={(e) =>
                                handleUpdate({
                                    ...changelog,
                                    summary: e.target.value,
                                })
                            }
                            className="w-full"
                            placeholder="Changelog Summary"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap">
                            {changelog.summary}
                        </p>
                    )}
                </div>
                {isOwner && (
                    <Button
                        variant="default"
                        className="w-full place-self-center bg-blue-500 hover:bg-blue-600"
                        onClick={handleUpdatePublished}
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        {changelog.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                )}
            </div>
            {/* Entries */}
            <ScrollArea className={`w-full ${inModal ? 'h-[500px]' : ''}`}>
                <div className="w-full space-y-4">
                    {changelog.entries.map(
                        (
                            entry: ChangelogEntryWithPRsAndCommits,
                            index: number
                        ) => (
                            <Card
                                key={entry.id}
                                className="relative w-full hover:shadow-md transition-shadow duration-300 ease-in-out"
                            >
                                <CardHeader className="flex flex-col space-y-2 w-full">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        {/* Message */}
                                        <CardTitle className="font-bold w-2/3">
                                            {isEditing ? (
                                                <Input
                                                    value={entry.message}
                                                    onChange={(e) =>
                                                        handleEntryUpdate(
                                                            index,
                                                            {
                                                                message:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="w-full text-lg"
                                                />
                                            ) : (
                                                <span className="w-full">
                                                    {entry.message}
                                                </span>
                                            )}
                                        </CardTitle>
                                        {/* Breaking Change */}
                                        {isEditing ? (
                                            <div className="flex items-center space-x-2 justify-center">
                                                <Switch
                                                    checked={
                                                        entry.breakingChange ??
                                                        false
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleUpdateBreakingChange(
                                                            index,
                                                            checked
                                                        )
                                                    }
                                                    id={`breaking-change-${entry.id}`}
                                                />
                                                <Label
                                                    htmlFor={`breaking-change-${entry.id}`}
                                                    className="text-sm whitespace-nowrap"
                                                >
                                                    Breaking Change
                                                </Label>
                                            </div>
                                        ) : (
                                            entry.breakingChange && (
                                                <Badge
                                                    variant="destructive"
                                                    className="whitespace-nowrap"
                                                >
                                                    Breaking Change
                                                </Badge>
                                            )
                                        )}
                                        {/* Delete Entry Button */}
                                        {isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveEntry(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {/* Tags */}
                                        {entry.tags?.map((tag, tagIndex) => (
                                            <Badge
                                                key={tagIndex}
                                                variant="secondary"
                                                className="flex items-center space-x-1"
                                            >
                                                <span>{tag}</span>
                                                {isEditing && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveTag(
                                                                index,
                                                                tagIndex
                                                            )
                                                        }
                                                        className="text-xs ml-1"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                        {/* Add Tag */}
                                        {isEditing && (
                                            <Input
                                                placeholder="Add tag"
                                                className="w-24 h-6 text-xs"
                                                onKeyDown={(e) =>
                                                    handleAddTag(e, index)
                                                }
                                            />
                                        )}
                                    </div>
                                </CardHeader>
                                {/* Separator */}
                                <Separator className="w-[95%] mx-auto" />
                                {/* Entry Details */}
                                <CardContent className="pt-4 space-y-2">
                                    {[
                                        'impact',
                                        'technicalDetails',
                                        'userBenefit',
                                    ].map((field) => (
                                        <div key={field}>
                                            {/* Field Label */}
                                            <Label className="text-base font-semibold">
                                                {field
                                                    .split(/(?=[A-Z])/)
                                                    .map(
                                                        (word) =>
                                                            word
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            word.slice(1)
                                                    )
                                                    .join(' ')}
                                                :
                                            </Label>
                                            {/* Field Input */}
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {isEditing ? (
                                                    <Textarea
                                                        value={
                                                            (entry[
                                                                field as keyof ChangelogEntry
                                                            ] as string) || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleEntryUpdate(
                                                                index,
                                                                {
                                                                    [field]:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <p>
                                                        {(entry[
                                                            field as keyof ChangelogEntry
                                                        ] as string) || 'N/A'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Pull Requests */}
                                    {(isEditing ||
                                        entry.pullRequests?.length > 0) && (
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="pull-requests">
                                                <AccordionTrigger>
                                                    Associated Pull Requests
                                                </AccordionTrigger>
                                                <AccordionContent className="flex flex-col gap-2">
                                                    {entry.pullRequests?.map(
                                                        (pr, prIndex) => (
                                                            <div
                                                                key={pr.id}
                                                                className={`${
                                                                    isEditing
                                                                        ? 'px-2 my-2'
                                                                        : 'p-0'
                                                                } flex items-center space-x-2`}
                                                            >
                                                                {isEditing ? (
                                                                    <>
                                                                        <Input
                                                                            value={
                                                                                pr.prNumber
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleUpdatePullRequest(
                                                                                    index,
                                                                                    prIndex,
                                                                                    {
                                                                                        prNumber:
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ) ||
                                                                                            0,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-20"
                                                                            placeholder="PR #"
                                                                        />
                                                                        <Input
                                                                            value={
                                                                                pr.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleUpdatePullRequest(
                                                                                    index,
                                                                                    prIndex,
                                                                                    {
                                                                                        title: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="flex-grow"
                                                                            placeholder="PR Title"
                                                                        />
                                                                        <Input
                                                                            value={
                                                                                pr.url
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleUpdatePullRequest(
                                                                                    index,
                                                                                    prIndex,
                                                                                    {
                                                                                        url: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="flex-grow"
                                                                            placeholder="PR URL"
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleRemovePullRequest(
                                                                                    index,
                                                                                    prIndex
                                                                                )
                                                                            }
                                                                            className="hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <a
                                                                        href={
                                                                            pr.url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center text-blue-500 hover:text-blue-600"
                                                                    >
                                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                                        #
                                                                        {
                                                                            pr.prNumber
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            pr.title
                                                                        }
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                    {isEditing && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-fit ml-2"
                                                            onClick={() =>
                                                                handleAddPullRequest(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />{' '}
                                                            Add Pull Request
                                                        </Button>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    )}
                    {isEditing && (
                        <Button onClick={handleAddEntry} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Changelog
                            Entry
                        </Button>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
