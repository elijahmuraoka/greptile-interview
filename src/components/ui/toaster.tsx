'use client';

import { useToast } from '@/hooks/use-toast';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({
                id,
                title,
                description,
                action,
                variant,
                ...props
            }) {
                return (
                    <Toast key={id} variant={variant} {...props}>
                        <div className="grid gap-1">
                            {(variant || title) && (
                                <ToastTitle>
                                    {variant == 'success'
                                        ? '🎉 SUCCESS'
                                        : variant == 'destructive'
                                        ? '❌ FAILED'
                                        : title}
                                </ToastTitle>
                            )}
                            {description && (
                                <ToastDescription>
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
