'use client';

import { cn } from '@/lib/utils';
import { SiBookstack } from 'react-icons/si';

interface LogoProps {
    className?: string;
    invert?: boolean;
}

export default function Logo({ className, invert = false }: LogoProps) {
    return (
        <SiBookstack
            className={cn(
                'text-5xl border-[2px] rounded-lg p-[6px]',
                `${
                    invert
                        ? 'text-background border-background'
                        : 'text-foreground border-foreground'
                }`,
                className
            )}
        />
    );
}
