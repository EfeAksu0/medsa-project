'use client';

import { useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickDeleteProps {
    onDelete: () => void | Promise<void>;
    label?: string;
    iconSize?: number;
    className?: string;
    confirmTimeout?: number;
    disabled?: boolean;
}

export function QuickDelete({
    onDelete,
    label,
    iconSize = 16,
    className,
    confirmTimeout = 3000,
    disabled = false
}: QuickDeleteProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isConfirming) {
            timer = setTimeout(() => {
                setIsConfirming(false);
            }, confirmTimeout);
        }
        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [isConfirming, confirmTimeout]);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled || isLoading) return;

        if (!isConfirming) {
            setIsConfirming(true);
        } else {
            setIsLoading(true);
            try {
                await onDelete();
            } finally {
                setIsConfirming(false);
                setIsLoading(false);
            }
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsConfirming(false);
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled || isLoading}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                    isConfirming
                        ? "bg-red-500 text-white shadow-lg shadow-red-900/20 scale-105"
                        : "text-gray-500 hover:text-red-400 hover:bg-red-500/10",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
                title={isConfirming ? "Click again to confirm" : "Delete"}
            >
                {isConfirming ? (
                    <>
                        <Check size={iconSize} className="animate-in zoom-in-50" />
                        {label && <span className="text-[10px] font-bold uppercase tracking-wider">Confirm?</span>}
                    </>
                ) : (
                    <Trash2 size={iconSize} />
                )}
            </button>

            {isConfirming && (
                <button
                    type="button"
                    onClick={handleCancel}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg animate-in fade-in slide-in-from-left-2"
                >
                    <X size={iconSize - 2} />
                </button>
            )}
        </div>
    );
}
