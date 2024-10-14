'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { getRepositories } from '@/actions/githubActions';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import Changelog from './changelog';
import { useToast } from '@/hooks/use-toast';
import { Repository } from '@/actions/githubActions';
import { ChangelogWithEntries } from '@/db/schema';
import { generateAndSaveChangelog } from '@/actions/changelogActions';
import RepositorySearch from './repository-search';

const steps = [
    {
        title: 'Choose a Repository',
        description: 'Select a repository to generate a changelog for.',
    },
    {
        title: 'Edit and Publish',
        description:
            'Make any necessary changes, then choose visibility and publish.',
    },
];

export default function GenerateChangelogModal() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [changelog, setChangelog] = useState<ChangelogWithEntries | null>(
        null
    );
    const [selectedRepository, setSelectedRepository] =
        useState<Repository | null>(null);
    const [isGeneratingChangelog, setIsGeneratingChangelog] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

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
                // TODO: Make this configurable
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
            setCurrentStep(1);
        } catch (error) {
            console.error('Error generating changelog: ', error);
            toast({
                description:
                    (error as Error).message || 'Failed to generate changelog.',
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
            <DialogContent className="max-w-4xl flex flex-col gap-8 items-center p-12">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Step {currentStep + 1}: {steps[currentStep].title}
                    </DialogTitle>
                    <DialogDescription>
                        {steps[currentStep].description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row gap-4 w-full justify-center items-center">
                    <RepositorySearch
                        repositories={repositories}
                        selectedRepository={selectedRepository}
                        setSelectedRepository={setSelectedRepository}
                    />
                    <Button
                        disabled={!selectedRepository || isGeneratingChangelog}
                        onClick={handleGenerateChangelog}
                        className="w-2/3"
                    >
                        {isGeneratingChangelog
                            ? 'Generating...'
                            : 'Generate Changelog'}
                    </Button>
                </div>
                <Changelog changelog={changelog} />
            </DialogContent>
        </Dialog>
    );
}
