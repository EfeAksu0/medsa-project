'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { ArrowLeft, Tag, Trash2, Edit2, Save, X, Star, Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { QuickDelete } from '@/components/ui/QuickDelete';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/lib/api';

interface JournalEntry {
    id: string;
    date: string;
    content: string;
    tags: string[];
    mood?: string;
    rating?: number;
    userId: string;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JournalEntryPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: entry, isLoading, mutate: mutateEntry } = useSWR<JournalEntry>(
        id ? `/journal/${id}` : null,
        fetcher
    );

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit State
    const [editContent, setEditContent] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editMood, setEditMood] = useState('');
    const [editRating, setEditRating] = useState(0);

    const moods = [
        { name: 'Confident', icon: Smile, color: 'text-green-500' },
        { name: 'Neutral', icon: Meh, color: 'text-blue-500' },
        { name: 'Anxious', icon: AlertCircle, color: 'text-yellow-500' },
        { name: 'Frustrated', icon: Frown, color: 'text-red-500' },
    ];

    useEffect(() => {
        if (entry) {
            setEditContent(entry.content);
            setEditTags(entry.tags.join(', '));
            setEditMood(entry.mood || '');
            setEditRating(entry.rating || 0);
        }
    }, [entry]);

    const handleUpdate = async () => {
        try {
            const tagList = editTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            const response = await api.put(`/journal/${id}`, {
                content: editContent,
                tags: tagList,
                mood: editMood,
                rating: editRating
            });

            if (response.status === 200) {
                mutateEntry(response.data);
                setIsEditing(false);
                toast.success("Entry updated successfully.");
            } else {
                toast.error("Failed to update entry.");
            }
        } catch (error) {
            toast.error("Failed to save changes.");
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete(`/journal/${id}`);

            if (response.status === 200) {
                toast.success("Page burned.");
                router.push('/vault/notes');
            } else {
                toast.error("Failed to delete entry.");
                setIsDeleting(false);
            }
        } catch (error) {
            toast.error("Failed to delete entry.");
            setIsDeleting(false);
        }
    };

    if (isLoading && !entry) {
        return (
            <div className="max-w-4xl mx-auto animate-pulse space-y-8">
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
                <div className="h-96 bg-gray-900/50 rounded-2xl border border-gray-800"></div>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="text-center pt-20">
                <h2 className="text-red-500 text-xl font-bold">Entry not found.</h2>
                <Link href="/vault/notes" className="text-amber-500 mt-4 inline-block">Back to Archives</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Link
                    href="/vault/notes"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Archives
                </Link>

                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors border border-gray-700 font-mono text-sm"
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors font-bold font-mono text-sm"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded transition-colors border border-gray-800 hover:border-gray-700 font-mono text-sm"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <QuickDelete
                                onDelete={handleDelete}
                                label="Delete"
                                iconSize={16}
                                className="px-4 py-2 bg-gray-900 border border-gray-800 hover:border-red-900/50 font-mono text-sm h-[38px]"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Main Content Box */}
            <div className="bg-gray-900 border border-gray-800 rounded-none shadow-2xl overflow-hidden relative">
                {/* Top Decorations */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600/50 via-amber-500/50 to-amber-600/50"></div>

                {/* Edit Mode: Rating Selector */}
                {isEditing && (
                    <div className="bg-gray-950 border-b border-gray-800 p-4 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setEditRating(star)}
                                className={`transition-colors ${editRating >= star ? 'text-amber-400' : 'text-gray-700 hover:text-amber-900'}`}
                            >
                                <Star size={24} fill={editRating >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                )}

                {/* Meta Header */}
                <div className="bg-gray-900/80 border-b border-gray-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-12 bg-amber-500 rounded-sm"></div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-mono tracking-tight">
                                {format(new Date(entry.date), 'MMMM do, yyyy')}
                            </h1>
                            <div className="flex items-center gap-3 text-gray-400 text-sm mt-1">
                                <span>{format(new Date(entry.date), 'EEEE')}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                <span>{format(new Date(entry.date), 'h:mm a')}</span>
                                {!isEditing && entry.rating && entry.rating > 0 && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                        <div className="flex gap-0.5" title={`${entry.rating} Stars`}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className={i < entry.rating! ? "text-amber-500" : "text-gray-700"}
                                                    fill={i < entry.rating! ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex gap-2">
                            {moods.map((m) => (
                                <button
                                    key={m.name}
                                    onClick={() => setEditMood(m.name)}
                                    className={`p-2 rounded border transition-all ${editMood === m.name
                                        ? `${m.color} border-current bg-gray-800`
                                        : 'text-gray-600 border-gray-800 hover:border-gray-700'
                                        }`}
                                    title={m.name}
                                >
                                    <m.icon size={20} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        entry.mood && (
                            <div className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-sm flex items-center gap-2">
                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Mood</span>
                                <div className="w-px h-3 bg-gray-800"></div>
                                <span className="text-amber-500 font-bold font-mono">{entry.mood}</span>
                            </div>
                        )
                    )}
                </div>

                {/* Content Body */}
                <div className="p-8 md:p-10 min-h-[400px] bg-gradient-to-b from-gray-900/50 to-gray-950/50">
                    {isEditing ? (
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-[400px] bg-transparent border-none focus:ring-0 text-xl leading-relaxed text-gray-300 font-mono resize-none p-0"
                            placeholder="Write your observation..."
                        />
                    ) : (
                        <div className="prose prose-invert prose-amber max-w-none">
                            <p className="text-xl leading-relaxed text-gray-300 font-mono whitespace-pre-wrap">
                                {entry.content}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Tags */}
                <div className="px-8 py-6 bg-gray-950 border-t border-gray-800 flex items-center gap-3">
                    <Tag size={16} className="text-gray-600" />
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            className="bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1 rounded-sm text-sm font-mono focus:border-amber-500/50 focus:outline-none w-full max-w-md"
                            placeholder="Tags (comma separated)..."
                        />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {entry.tags.map(tag => (
                                <span key={tag} className="text-xs font-mono text-gray-400 px-2 py-1 bg-gray-900 border border-gray-800 rounded-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
