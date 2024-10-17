'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
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
import TimeframeInput from './timeframe-input';
import {
    ChevronLeft,
    ChevronRight,
    Rocket,
    PartyPopper,
    Undo2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type TimeframeUnit = 'days' | 'months' | 'years';

interface GenerateChangelogModalProps {
    onChangelogGenerated: () => void;
}

const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

export default function GenerateChangelogModal({
    onChangelogGenerated,
}: GenerateChangelogModalProps) {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [changelog, setChangelog] = useState<ChangelogWithEntries | null>(
        null
    );
    const [selectedRepository, setSelectedRepository] =
        useState<Repository | null>(null);
    const [isGeneratingChangelog, setIsGeneratingChangelog] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [timeframe, setTimeframe] = useState<{
        unit: TimeframeUnit;
        value: number;
    }>({
        unit: 'days',
        value: 7,
    });
    const [changelogHistory, setChangelogHistory] = useState<
        ChangelogWithEntries[]
    >([]);

    const { toast } = useToast();

    const steps = [
    {
        title: 'Choose a Repository',
        description:
            'Select a repository and the timeframe to generate the changelog.',
    },
    {
        title: 'Edit and Publish',
        description: (
            <>
                Make changes to your changelog before publishing. For the best
                editing experience,{' '}
                <Link
                    href={`/directory/changelog/${changelog?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline hover:text-blue-600 hover:underline-offset-4 duration-150 ease-in-out"
                >
                    view the changelog in full-screen
                </Link>
                .
            </>
        ),
    },
    {
        title: 'Success!',
        description: 'Changelog generated and published successfully.',
    },
];

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
                timeframe
            );
            setChangelog(changelog);
            toast({
                description: 'Changelog generated successfully.',
                variant: 'success',
            });
            handleNext();
            setChangelogHistory([changelog]);
        } catch (error) {
            console.error('Error generating changelog: ', error);
            toast({
                description:
                    (error as Error).message || 'Failed to generate changelog.',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingChangelog(false);
            onChangelogGenerated();
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleRestart = () => {
        setSelectedRepository(null);
        setChangelog(null);
        setTimeframe({ unit: 'days', value: 7 });
        setCurrentStep(0);
    };

    const handleChangelogUpdate = (updatedChangelog: ChangelogWithEntries) => {
        setChangelog(updatedChangelog);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col items-center justify-center h-full gap-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-inner">
                        <Rocket className="w-16 h-16 text-blue-500 animate-bounce" />
                        <div className="w-full max-w-lg space-y-4">
                            <RepositorySearch
                                repositories={repositories}
                                selectedRepository={selectedRepository}
                                setSelectedRepository={setSelectedRepository}
                            />
                            <TimeframeInput
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                            />
                            <Button
                                onClick={handleGenerateChangelog}
                                disabled={
                                    !selectedRepository || isGeneratingChangelog
                                }
                                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                            >
                                {isGeneratingChangelog ? (
                                    <>
                                        Generating...
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    'Generate Changelog'
                                )}
                            </Button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col h-full gap-4 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-inner overflow-hidden">
                        {changelog && (
                            <Changelog
                                isOwner={true}
                                changelog={changelog}
                                onChangelogUpdate={handleChangelogUpdate}
                            />
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-inner">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                            }}
                        >
                            <PartyPopper className="w-24 h-24 text-green-500 mb-6" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-3xl font-bold mb-4 text-green-700">
                                Changelog Published!
                            </h3>
                            <p className="text-lg text-green-600 mb-8">
                                Your changelog has been successfully generated
                                and published.
                            </p>
                            <div className="space-y-4">
                                <Button className="w-full bg-green-500 hover:bg-green-600 transition-colors">
                                    <Link
                                        href={`/directory/changelog/${changelog?.id}`}
                                    >
                                        View Changelog
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleRestart}
                                    className="w-full border-green-500 text-green-600 hover:bg-green-100"
                                >
                                    Create New Changelog
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="w-full">Generate New Changelog</Button>
            </DialogTrigger>
            <DialogContent className="min-h-[98vh] max-w-[98vw] flex flex-col justify-between gap-6 items-center p-6">
                <DialogHeader className="w-full flex flex-col items-center justify-center">
                    <DialogTitle className="text-2xl">
                        {steps[currentStep].title}
                    </DialogTitle>
                    <DialogDescription>
                        {steps[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full h-full flex-grow overflow-hidden relative">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={pageTransition}
                            className="absolute w-full h-full"
                        >
                            {renderStepContent(currentStep)}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between w-full">
                    {currentStep < 2 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    )}
                    {currentStep === 2 && <div />}
                    {currentStep < steps.length - 1 && (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 0 && !changelog) ||
                                (currentStep === 1 && !changelog)
                            }
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
