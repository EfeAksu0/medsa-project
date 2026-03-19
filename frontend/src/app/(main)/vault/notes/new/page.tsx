'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Smile, Meh, Frown, AlertCircle, Tag, Star } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function NewNotePage() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [mood, setMood] = useState('');
    const [rating, setRating] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [folderId, setFolderId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setFolderId(params.get('folderId'));
    }, []);

    const moods = [
        { name: 'Confident', icon: Smile, color: 'text-green-500', border: 'border-green-500/50', bg: 'bg-green-500/10' },
        { name: 'Neutral', icon: Meh, color: 'text-blue-500', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
        { name: 'Anxious', icon: AlertCircle, color: 'text-yellow-500', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
        { name: 'Frustrated', icon: Frown, color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10' },
    ];

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error("The log cannot be empty.");
            return;
        }

        setIsSaving(true);
        try {
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            await api.post('/journal', {
                content,
                tags: tagList,
                mood,
                rating,
                ...(folderId ? { folderId } : {}),
            });

            toast.success("Entry recorded in the archives.");
            router.push('/vault/notes');
        } catch (error) {
            console.error('Save error', error);
            toast.error("Connection severed to the archives.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/vault/notes"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Archives
                </Link>
                <h1 className="text-2xl font-bold text-white font-mono hidden md:block">New Entry</h1>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                {/* Header Strip */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>

                <div className="p-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you observe in the markets today? How did you execute your strategy?"
                        className="w-full h-[400px] bg-gray-950/50 text-gray-300 p-6 text-lg font-mono leading-relaxed border-none resize-none focus:ring-0 placeholder:text-gray-700"
                    />
                </div>

                <div className="border-t border-gray-800 bg-gray-900/50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mood & Rating Selection */}
                    <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block">
                            Performance Rating
                        </label>
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-colors ${rating >= star ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500/50'}`}
                                >
                                    <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>

                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block">
                            Warrior&apos;s Mood
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {moods.map((m) => (
                                <button
                                    key={m.name}
                                    onClick={() => setMood(m.name)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${mood === m.name
                                        ? `${m.border} ${m.bg} ${m.color}`
                                        : 'border-gray-800 bg-gray-900/50 text-gray-600 hover:border-gray-700 hover:bg-gray-800'
                                        }`}
                                >
                                    <m.icon size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold">{m.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block">
                            Battle Tags
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-3 text-gray-600" size={18} />
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Trend Day, Chop, FOMO (comma separated)"
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-gray-300 text-sm font-mono focus:border-amber-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <p className="text-[10px] text-gray-600 pl-1">Separate tags with commas</p>
                    </div>
                </div>

                <div className="p-6 bg-gray-950 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {isSaving ? 'Recording...' : 'Save to Archives'}
                    </button>
                </div>
            </div>
        </div>
    );
}
