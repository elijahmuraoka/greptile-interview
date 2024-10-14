'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { getRepositories } from '@/actions/githubActions';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Changelog from './changelog';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Repository } from '@/actions/githubActions';
import { ChangelogWithEntries } from '@/db/schema';
import { generateAndSaveChangelog } from '@/actions/changelogActions';

export default function GenerateChangelogModal() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [changelog, setChangelog] = useState<ChangelogWithEntries | null>(
        null
    );
    const [open, setOpen] = useState(false);
    const [selectedRepository, setSelectedRepository] =
        useState<Repository | null>(null);
    const [isGeneratingChangelog, setIsGeneratingChangelog] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const repositories = await getRepositories();
                setRepositories(repositories);
            } catch (error) {
                toast({
                    description: 'Failed to fetch repositories.',
                    variant: 'destructive',
                });
            }
        };

        fetchRepositories();
    }, []);

    const handleGenerateChangelog = async () => {
        if (!selectedRepository) return;
        setIsGeneratingChangelog(true);
        try {
            const changelog = await generateAndSaveChangelog(
                selectedRepository,
                {
                    unit: 'days',
                    value: 14,
                }
            );
            setChangelog(changelog);
            toast({
                description: 'Changelog generated successfully.',
                variant: 'success',
            });
        } catch (error) {
            console.error('Error generating changelog: ', error);
            toast({
                description: 'Failed to generate changelog.',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingChangelog(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="w-full">Generate New Changelog</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl flex flex-col gap-8 items-center p-12">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Step 1: Select A Repository
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-row gap-4 w-full justify-center items-center">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                            >
                                {selectedRepository
                                    ? repositories.find(
                                          (repository) =>
                                              repository.id ===
                                              selectedRepository.id
                                      )?.name
                                    : 'Select repository...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search repository..." />
                                <CommandList>
                                    <CommandEmpty>
                                        No repository found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {repositories.map((repository) => (
                                            <CommandItem
                                                key={repository.id}
                                                value={repository.name}
                                                onSelect={(
                                                    currentSelectedRepository
                                                ) => {
                                                    setSelectedRepository(
                                                        repositories.find(
                                                            (repo) =>
                                                                repo.name ===
                                                                currentSelectedRepository
                                                        ) || selectedRepository
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        selectedRepository?.id ===
                                                            repository.id
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {repository.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button
                        disabled={!selectedRepository || isGeneratingChangelog}
                        onClick={handleGenerateChangelog}
                        className="w-2/3"
                    >
                        {isGeneratingChangelog
                            ? 'Generating...'
                            : 'AI Generate Changelog'}
                    </Button>
                </div>
                <Changelog changelog={changelog} />
            </DialogContent>
        </Dialog>
    );
}
