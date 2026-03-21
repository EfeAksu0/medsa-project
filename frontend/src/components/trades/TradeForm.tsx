'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trade, TradeFormData } from '@/types/trade';
import { Account, Model } from '@/types/trading';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import api, { uploadImage, API_URL } from '@/lib/api';
import {
    Calendar,
    DollarSign,
    Hash,
    Target,
    Brain,
    Activity,
    StickyNote,
    Zap,
    Clock,
    BarChart3,
    Tags,
    ChevronDown,
    Check,
    Plus,
    Image as ImageIcon,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';

// Helper function to get local date in YYYY-MM-DD HH:mm:ss format
const getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const schema = z.object({
    instrument: z.string().min(1, 'Instrument is required'),
    entryPrice: z.coerce.number().nullable().optional(),
    exitPrice: z.coerce.number().nullable().optional(),
    stopLoss: z.coerce.number().nullable().optional(),
    takeProfit: z.coerce.number().nullable().optional(),
    quantity: z.coerce.number().nullable().optional(),
    pnl: z.coerce.number().nullable().optional(),
    result: z.enum(['WIN', 'LOSS', 'BREAKEVEN', 'OPEN']),
    notes: z.string().optional(),
    tradeDate: z.string().min(1, 'Open date is required'),
    exitDate: z.string().nullable().optional(),
    strategy: z.string().optional(),
    session: z.string().optional(),
    accountId: z.string().nullable().optional(),
    modelId: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
});

interface TradeFormProps {
    initialData?: Trade | null;
    onSubmit: (data: TradeFormData) => Promise<void>;
    isSubmitting: boolean;
}

export function TradeForm({ initialData, onSubmit, isSubmitting }: TradeFormProps) {
    const [showInstruments, setShowInstruments] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [loadingModels, setLoadingModels] = useState(true);
    const [customInstruments, setCustomInstruments] = useState<string[]>([]);
    const [newCustomInstrument, setNewCustomInstrument] = useState('');

    // Drag & Drop State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TradeFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema) as any,
        defaultValues: {
            result: 'OPEN',
            tradeDate: getLocalDateTime(),
            quantity: 1,
            accountId: null,
            modelId: null,
        }
    });

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                alert("File size too large (Max 50MB)");
                return;
            }

            // Allow all image types, plus specific handling for user request (.pgn -> likely .png typo)
            // We just warn if it looks weird but try to process it anyway.
            if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.pgn')) {
                const proceed = window.confirm("This file doesn't look like an image. Try to upload anyway?");
                if (!proceed) return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            try {
                // Upload immediately to get the URL
                const uploadedUrl = await uploadImage(file);
                setValue('imageUrl', uploadedUrl);
            } catch (error) {
                console.error("Error uploading file", error);
                alert("Failed to upload image. Please try again.");
                // Revert preview on failure
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        }
    }, [setValue]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        // Removed 'accept' to allow all files to be dropped.
        maxFiles: 1,
        noClick: false // Always allow clicking to open file dialog
    });

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setValue('imageUrl', null);
    };

    const defaultInstruments = [
        'US30', 'NAS100', 'SPX500', 'GER40',
        'EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'NZDUSD',
        'BTCUSD', 'ETHUSD', 'SOLUSD'
    ];

    const allInstruments = Array.from(new Set([...defaultInstruments, ...customInstruments]));

    // Load custom instruments
    useEffect(() => {
        const saved = localStorage.getItem('medysa_custom_instruments');
        if (saved) {
            try {
                setCustomInstruments(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse custom instruments");
            }
        }
    }, []);

    // Save custom instruments
    useEffect(() => {
        if (customInstruments.length > 0) {
            localStorage.setItem('medysa_custom_instruments', JSON.stringify(customInstruments));
        }
    }, [customInstruments]);

    const handleAddCustomInstrument = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) e.stopPropagation();
        if (!newCustomInstrument.trim()) return;

        const upper = newCustomInstrument.trim().toUpperCase();
        if (!allInstruments.includes(upper)) {
            setCustomInstruments(prev => [...prev, upper]);
        }
        setValue('instrument', upper, { shouldValidate: true });
        setNewCustomInstrument('');
        setShowInstruments(false);
    };

    // Set initial values including modelId
    useEffect(() => {
        if (initialData) {
            reset({
                instrument: initialData.instrument,
                entryPrice: initialData.entryPrice,
                exitPrice: initialData.exitPrice,
                stopLoss: initialData.stopLoss,
                takeProfit: initialData.takeProfit,
                quantity: initialData.quantity,
                pnl: initialData.pnl,
                result: initialData.result,
                notes: initialData.notes || '',
                tradeDate: initialData.tradeDate,
                exitDate: initialData.exitDate || '',
                strategy: initialData.strategy || '',
                session: initialData.session || '',
                accountId: initialData.accountId || null,
                modelId: initialData.modelId || null,
                imageUrl: initialData.imageUrl || null,
            });
        } else {
            reset({
                result: 'OPEN',
                tradeDate: getLocalDateTime(),
                quantity: 1,
                instrument: '',
                entryPrice: null,
                exitPrice: null,
                stopLoss: null,
                takeProfit: null,
                pnl: null,
                notes: '',
                exitDate: '',
                strategy: '',
                session: '',
                accountId: null,
                modelId: null,
                imageUrl: null,
            });
        }
    }, [initialData, reset]);

    // Fetch accounts and models
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountsRes, modelsRes] = await Promise.all([
                    api.get('/accounts'),
                    api.get('/models')
                ]);
                setAccounts(accountsRes.data);
                setModels(modelsRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoadingAccounts(false);
                setLoadingModels(false);
            }
        };
        fetchData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest('.instrument-container')) {
                setShowInstruments(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInstrumentSelect = (value: string) => {
        setValue('instrument', value, { shouldValidate: true });
        setShowInstruments(false);
    };

    // Auto-set result based on PnL
    const watchedPnl = watch('pnl');
    useEffect(() => {
        if (watchedPnl === null || watchedPnl === undefined) return;

        const pnlNum = Number(watchedPnl);
        if (pnlNum > 0) {
            setValue('result', 'WIN');
        } else if (pnlNum < 0) {
            setValue('result', 'LOSS');
        } else if (pnlNum === 0 && watch('result') !== 'OPEN') {
            setValue('result', 'BREAKEVEN');
        }
    }, [watchedPnl, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section: Trade Identity & Timing */}
            <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-800/50 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Zap size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Trade Setup</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Instrument */}
                    <div className="space-y-2 relative group instrument-container">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <BarChart3 size={14} /> Instrument
                        </label>
                        <div className="relative">
                            <input
                                {...register('instrument')}
                                autoComplete="off"
                                onFocus={() => setShowInstruments(true)}
                                className={cn(
                                    "w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11",
                                    errors.instrument && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                )}
                                placeholder="e.g. EURUSD"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Activity size={18} />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown size={16} />
                            </div>

                            {showInstruments && (
                                <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-h-80 overflow-y-auto flex flex-col backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                                    <div className="flex-1 overflow-y-auto">
                                        {allInstruments.map((inst) => (
                                            <button
                                                key={inst}
                                                type="button"
                                                onClick={() => handleInstrumentSelect(inst)}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors border-b border-gray-800 last:border-0 flex items-center justify-between group/item"
                                            >
                                                {inst}
                                                <Check size={14} className="opacity-0 group-hover/item:opacity-100 text-blue-500 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Add Custom Pair Section */}
                                    <div className="p-2 bg-gray-950 border-t border-gray-800 sticky bottom-0">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCustomInstrument}
                                                onChange={(e) => setNewCustomInstrument(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomInstrument(e)}
                                                placeholder="ADD PAIR (e.g. BTCUSD)"
                                                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddCustomInstrument()}
                                                disabled={!newCustomInstrument.trim()}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                ADD
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.instrument && <p className="text-xs text-red-400 font-medium pl-1">{errors.instrument.message}</p>}
                    </div>

                    {/* Open Date */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock size={14} /> Open Date
                        </label>
                        <div className="relative">
                            <input
                                {...register('tradeDate')}
                                type="text"
                                className={cn(
                                    "w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11",
                                    errors.tradeDate && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                )}
                                placeholder="YYYY-MM-DD"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Calendar size={18} />
                            </div>
                        </div>
                        {errors.tradeDate && <p className="text-xs text-red-400 font-medium pl-1">{errors.tradeDate.message}</p>}
                    </div>

                    {/* Close Date */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock size={14} /> Close Date
                        </label>
                        <div className="relative">
                            <input
                                {...register('exitDate')}
                                type="text"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11"
                                placeholder="Optional"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Calendar size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <DollarSign size={14} /> Account
                        </label>
                        <div className="relative">
                            <select
                                {...register('accountId')}
                                disabled={loadingAccounts}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none pl-11 cursor-pointer"
                            >
                                <option value="">Select Account</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.type})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                                <Hash size={18} />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Model */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Brain size={14} /> Model
                        </label>
                        <div className="relative">
                            <select
                                {...register('modelId')}
                                disabled={loadingModels}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none pl-11 cursor-pointer"
                            >
                                <option value="">Select Model</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                                <Target size={18} />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Execution Details */}
            <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-800/50 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Activity size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Execution Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Entry Price */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <DollarSign size={14} /> Entry Price
                        </label>
                        <div className="relative">
                            <input
                                {...register('entryPrice')}
                                type="number"
                                step="any"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11"
                                placeholder="0.00"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Zap size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Exit Price */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <DollarSign size={14} /> Exit Price
                        </label>
                        <div className="relative">
                            <input
                                {...register('exitPrice')}
                                type="number"
                                step="any"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11"
                                placeholder="0.00"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Zap size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Lot/Contract */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Hash size={14} /> Lot/Contract
                        </label>
                        <div className="relative">
                            <input
                                {...register('quantity')}
                                type="number"
                                step="any"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11"
                                placeholder="1.0"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Activity size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Stop Loss */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Target size={14} /> Stop Loss
                        </label>
                        <div className="relative">
                            <input
                                {...register('stopLoss')}
                                type="number"
                                step="any"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11 text-red-400"
                                placeholder="0.00"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400/50 transition-colors">
                                <Target size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Take Profit */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Target size={14} /> Take Profit
                        </label>
                        <div className="relative">
                            <input
                                {...register('takeProfit')}
                                type="number"
                                step="any"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11 text-green-400"
                                placeholder="0.00"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400/50 transition-colors">
                                <Target size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Tags size={14} /> Strategy
                        </label>
                        <div className="relative">
                            <input
                                {...register('strategy')}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11"
                                placeholder="e.g. SMC"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <Tags size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Outcome & Notes */}
            <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-800/50 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                        <BarChart3 size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Outcome & Notes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Chart Screenshot Upload */}
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <ImageIcon size={14} /> Chart Screenshot
                        </label>

                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <ImageIcon size={14} /> Chart Screenshot
                        </label>

                        <div
                            {...getRootProps()}
                            className={cn(
                                "relative transition-all duration-200 ease-in-out border-2 border-dashed rounded-xl group/upload cursor-pointer",
                                isDragActive
                                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                                    : "border-gray-800 bg-gray-900/30 hover:bg-gray-800/50 hover:border-blue-500/50"
                            )}
                        >
                            <input {...getInputProps()} />

                            {!previewUrl ? (
                                <div className="flex flex-col items-center justify-center w-full h-[150px] pointer-events-none">
                                    <div className={cn(
                                        "flex flex-col items-center justify-center pt-5 pb-6 transition-all duration-300",
                                        isDragActive ? "scale-110" : ""
                                    )}>
                                        <div className="p-4 bg-gray-800 rounded-full mb-3 group-hover/upload:bg-blue-500/20 transition-colors">
                                            <Upload
                                                className={cn(
                                                    "w-6 h-6 transition-colors",
                                                    isDragActive ? "text-blue-400" : "text-gray-400 group-hover/upload:text-blue-400"
                                                )}
                                            />
                                        </div>
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold text-white">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Any image file (max 50MB)
                                        </p>

                                        {/* Explicit + Button requested by user */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Stop bubbling to parent div (though parent opens too, this is specific)
                                                open();
                                            }}
                                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors pointer-events-auto shadow-lg shadow-blue-500/20"
                                        >
                                            + Select File
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-[150px] rounded-xl overflow-hidden group/image">
                                    <Image
                                        src={previewUrl.startsWith('/') ? `${API_URL.replace('/api', '')}${previewUrl}` : previewUrl}
                                        alt="Chart preview"
                                        fill
                                        className="object-cover transition-transform group-hover/image:scale-105"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <p className="text-white font-medium text-sm flex items-center gap-2">
                                            <Upload size={14} /> Change Image
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-all opacity-0 group-hover/image:opacity-100 z-30"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Result */}
                        <div className="space-y-2 group">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Activity size={14} /> Result
                            </label>
                            <div className="relative">
                                <select
                                    {...register('result')}
                                    className={cn(
                                        "w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none pl-11 cursor-pointer font-bold",
                                        watch('result') === 'WIN' && "text-green-400",
                                        watch('result') === 'LOSS' && "text-red-400",
                                        watch('result') === 'OPEN' && "text-blue-400",
                                        watch('result') === 'BREAKEVEN' && "text-yellow-400"
                                    )}
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="WIN">WIN</option>
                                    <option value="LOSS">LOSS</option>
                                    <option value="BREAKEVEN">BREAKEVEN</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                                    <Zap size={18} />
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* PnL */}
                        <div className="space-y-2 group">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <DollarSign size={14} /> Profit / Loss ($)
                            </label>
                            <div className="relative">
                                <input
                                    {...register('pnl')}
                                    type="number"
                                    step="any"
                                    className={cn(
                                        "w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pl-11 font-bold",
                                        (watchedPnl ?? 0) > 0 ? "text-green-400" : (watchedPnl ?? 0) < 0 ? "text-red-400" : "text-white"
                                    )}
                                    placeholder="0.00"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 group">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <StickyNote size={14} /> Notes
                        </label>
                        <div className="relative h-full pb-8">
                            <textarea
                                {...register('notes')}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-[132px] resize-none pl-11"
                                placeholder="Add your trade notes here..."
                            />
                            <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                <StickyNote size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving Trade...</span>
                        </>
                    ) : (
                        <>
                            <Check size={20} />
                            <span>Save Trade</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
