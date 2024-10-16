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
import { ExternalLink, Trash2, Plus, Undo2, Edit, Globe, Save, Loader2 } from 'lucide-react';
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
import { updateChangelogWithEntriesAction } from '@/actions/changelogActions';

interface ChangelogProps {
  changelog: ChangelogWithEntries;
  changelogHistory: ChangelogWithEntries[];
  isOwner: boolean;
  inModal: boolean;
  onChangelogUpdate: (updatedChangelog: ChangelogWithEntries) => void;
  onUndo: () => void;
}

export default function Changelog({
  changelog,
  changelogHistory,
  isOwner,
  inModal,
  onChangelogUpdate,
  onUndo,
}: ChangelogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  const toggleEditing = async () => {
    try {
      if (isEditing) {
        setIsSaving(true);
        await updateChangelogWithEntriesAction(changelog.id, changelog);
        setIsSaving(false);
        handleUpdate(changelog);
        toast({
          description: 'Changelog updates saved successfully!',
          variant: 'success',
        });
      }
      setIsEditing(!isEditing);
    } catch (error) {
      console.error('Error saving changelog updates: ', error);
      toast({
        description: 'Error saving changelog updates. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Changelog Update Handlers

  const handleUpdate = async (updatedChangelog: ChangelogWithEntries) => {
    onChangelogUpdate(updatedChangelog);
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
      entries: changelog.entries.map((e, i) => (i === entryIndex ? { ...e, ...updatedEntry } : e)),
    });
  };

  const handleUpdatePublished = async () => {
    const published = !changelog.isPublished;
    try {
      setIsPublishing(true);
      const updatedChangelog = { ...changelog, isPublished: published };
      await updateChangelogWithEntriesAction(updatedChangelog.id, updatedChangelog);
      handleUpdate(updatedChangelog);
      if (published) {
        toast({
          description: 'Your changelog has been published and is now visible to the public.',
          variant: 'success',
        });
      } else {
        toast({
          description: 'Your changelog has been unpublished and is now hidden from the public.',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error publishing changelog: ', error);
      toast({
        description: 'Error publishing changelog. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Entry Field Handlers

  const handleUpdateBreakingChange = (entryIndex: number, breakingChange: boolean) => {
    handleEntryUpdate(entryIndex, { breakingChange });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
    const updatedTags = changelog.entries[entryIndex].tags?.filter((_, i) => i !== tagIndex);
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
      pullRequests: [...(changelog.entries[entryIndex].pullRequests || []), newPR],
    };
    handleEntryUpdate(entryIndex, updatedEntry);
  };

  const handleUpdatePullRequest = (
    entryIndex: number,
    prIndex: number,
    updatedPR: Partial<PullRequest>
  ) => {
    const updatedPRs = changelog.entries[entryIndex].pullRequests?.map((pr, i) =>
      i === prIndex ? { ...pr, ...updatedPR } : pr
    );
    handleEntryUpdate(entryIndex, { pullRequests: updatedPRs });
  };

  const handleRemovePullRequest = (entryIndex: number, prIndex: number) => {
    const updatedPRs = changelog.entries[entryIndex].pullRequests?.filter((_, i) => i !== prIndex);
    handleEntryUpdate(entryIndex, { pullRequests: updatedPRs });
  };

  const handleUndo = async () => {
    try {
      onUndo();
    } catch (error) {
      console.error('Error undoing changes to changelog: ', error);
      toast({
        description: 'Error undoing changes to changelog. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={`${!inModal ? 'w-[90vw]' : 'w-full'} flex flex-col gap-4 bg-transparent mx-auto h-full flex-shrink-0`}
    >
      {/* Navbar - [Undo, Title, Edit] + Summary */}
      <div
        className={`${
          inModal ? 'flex-grow' : 'sticky top-16'
        } flex flex-col text-card-foreground border-b border-border z-10 w-full p-6 gap-4 bg-background`}
        style={{ '--navbar-height': 'calc(100% + 1rem)' } as React.CSSProperties}
      >
        <div className="flex justify-between items-start w-full flex-row gap-4">
          {/* Left column: Title and Summary */}
          <div className="w-2/3 flex flex-col gap-4">
            <div className="text-3xl font-bold">
              {isEditing ? (
                <Input
                  value={changelog.title}
                  onChange={(e) =>
                    handleUpdate({
                      ...changelog,
                      title: e.target.value,
                    })
                  }
                  className="text-2xl"
                  placeholder="Changelog Title"
                />
              ) : (
                <h2>{changelog.title}</h2>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
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
                <p className="whitespace-pre-wrap">{changelog.summary}</p>
              )}
            </div>
          </div>

          {/* Right column: Edit, Undo, and Publish buttons */}
          {isOwner && (
            <div className="w-1/4 flex flex-col space-y-4 items-end">
              <div className="w-full flex flex-row space-x-2">
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={changelogHistory.length <= 1 || isSaving || !isEditing}
                  className="w-full"
                >
                  <Undo2 className="w-4 h-4 mr-2" /> Undo
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleEditing}
                  disabled={isSaving || isPublishing}
                  className={`w-full ${isEditing ? 'bg-green-200 hover:bg-green-300 border-green-400 border' : ''}`}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isEditing ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 w-full"
                onClick={handleUpdatePublished}
                disabled={isSaving || isPublishing}
              >
                {isPublishing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4 mr-2" />
                )}
                {isPublishing
                  ? !changelog.isPublished
                    ? 'Publishing...'
                    : 'Unpublishing...'
                  : changelog.isPublished
                    ? 'Unpublish'
                    : 'Publish'}
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Entries */}
      <ScrollArea className={`${inModal ? 'flex-grow' : 'h-full'} flex w-full`}>
        <div className="w-full space-y-4">
          {changelog.entries.map((entry: ChangelogEntryWithPRsAndCommits, index: number) => (
            <Card
              key={entry.id}
              className="relative w-full hover:shadow-sm hover:border-gray-400 hover:border-2 transition-all duration-300 ease-in-out"
            >
              <CardHeader className="flex flex-col space-y-4 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  {/* Message */}
                  <CardTitle className="font-semibold w-3/4">
                    {isEditing ? (
                      <Input
                        value={entry.message}
                        onChange={(e) =>
                          handleEntryUpdate(index, {
                            message: e.target.value,
                          })
                        }
                        className="w-full text-lg"
                      />
                    ) : (
                      <span className="w-full">{entry.message}</span>
                    )}
                  </CardTitle>
                  {/* Breaking Change */}
                  {isEditing ? (
                    <div className="flex items-center space-x-2 justify-center">
                      <Switch
                        checked={entry.breakingChange ?? false}
                        onCheckedChange={(checked) => handleUpdateBreakingChange(index, checked)}
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
                      <Badge variant="destructive" className="whitespace-nowrap">
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
                      onClick={() => handleRemoveEntry(index)}
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
                          onClick={() => handleRemoveTag(index, tagIndex)}
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
                      onKeyDown={(e) => handleAddTag(e, index)}
                    />
                  )}
                </div>
              </CardHeader>
              {/* Separator */}
              <Separator className="w-[95%] mx-auto" />
              {/* Entry Details */}
              <CardContent className="pt-2 space-y-2">
                {['impact', 'technicalDetails', 'userBenefit'].map((field) => (
                  <div key={field}>
                    {/* Field Label */}
                    <Label className="text-base font-semibold">
                      {field
                        .split(/(?=[A-Z])/)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                      :
                    </Label>
                    {/* Field Input */}
                    <div className="mt-1 text-sm text-muted-foreground">
                      {isEditing ? (
                        <Textarea
                          value={(entry[field as keyof ChangelogEntry] as string) || ''}
                          onChange={(e) =>
                            handleEntryUpdate(index, {
                              [field]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p>{(entry[field as keyof ChangelogEntry] as string) || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                ))}
                {/* Pull Requests */}
                {(isEditing || entry.pullRequests?.length > 0) && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="pull-requests">
                      <AccordionTrigger>Associated Pull Requests</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2">
                        {entry.pullRequests?.map((pr, prIndex) => (
                          <div
                            key={pr.id}
                            className={`${
                              isEditing ? 'px-2 my-2' : 'p-0'
                            } flex items-center space-x-2`}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={pr.prNumber}
                                  onChange={(e) =>
                                    handleUpdatePullRequest(index, prIndex, {
                                      prNumber: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-20"
                                  placeholder="PR #"
                                />
                                <Input
                                  value={pr.title}
                                  onChange={(e) =>
                                    handleUpdatePullRequest(index, prIndex, {
                                      title: e.target.value,
                                    })
                                  }
                                  className="flex-grow"
                                  placeholder="PR Title"
                                />
                                <Input
                                  value={pr.url}
                                  onChange={(e) =>
                                    handleUpdatePullRequest(index, prIndex, {
                                      url: e.target.value,
                                    })
                                  }
                                  className="flex-grow"
                                  placeholder="PR URL"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePullRequest(index, prIndex)}
                                  className="hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <a
                                href={pr.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:text-blue-600"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />#{pr.prNumber} - {pr.title}
                              </a>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-fit ml-2"
                            onClick={() => handleAddPullRequest(index)}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Pull Request
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
          {isEditing && (
            <Button onClick={handleAddEntry} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Changelog Entry
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
