'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Calendar, Tag, ChevronRight, Star, Folder, FolderPlus, ArrowLeft, Trash2, Edit2, FolderMinus } from 'lucide-react';
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
    folderId?: string;
}

interface JournalFolder {
    id: string;
    name: string;
    _count?: {
        entries: number;
    };
}

export default function NotesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [folders, setFolders] = useState<JournalFolder[]>([]);
    const [currentFolder, setCurrentFolder] = useState<JournalFolder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Create Folder State
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [currentFolder]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Folders
            let fetchedFolders: JournalFolder[] = [];
            if (!currentFolder) {
                const folderRes = await api.get('/journal/folders');
                if (folderRes.status === 200) fetchedFolders = folderRes.data;
            }
            setFolders(fetchedFolders);

            // Fetch Entries
            const url = '/journal';
            const params: Record<string, string> = {};
            if (currentFolder) {
                params.folderId = currentFolder.id;
            } else {
                params.root = 'true';
            }

            const entriesRes = await api.get(url, { params });
            if (entriesRes.status === 200) {
                setEntries(entriesRes.data);
            }

        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error("Failed to load archives.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const response = await api.post('/journal/folders', { name: newFolderName });

            if (response.status === 201) {
                toast.success("Folder created.");
                setNewFolderName('');
                setIsCreatingFolder(false);
                fetchData();
            } else {
                toast.error("Failed to create folder.");
            }
        } catch (error) {
            toast.error("Error creating folder.");
        }
    };

    const handleDeleteFolder = (e: React.MouseEvent, folderId: string) => {
        e.stopPropagation();
        setDeleteConfirm(folderId);
    };

    const executeDeleteFolder = async () => {
        if (!deleteConfirm) return;

        try {
            const response = await api.delete(`/journal/folders/${deleteConfirm}`);

            if (response.status === 200) {
                toast.success("Folder deleted.");
                fetchData();
                setDeleteConfirm(null);
            } else {
                toast.error("Failed to delete folder.");
            }
        } catch (error) {
            toast.error("Error deleting folder.");
        }
    };

    const handleMoveEntry = async (entryId: string, folderId: string | null) => {
        try {
            const response = await api.put(`/journal/${entryId}`, { folderId });

            if (response.status === 200) {
                toast.success(folderId ? "Note moved to folder." : "Note removed from folder.");
                fetchData();
            } else {
                toast.error("Failed to move note.");
            }
        } catch (error) {
            toast.error("Error moving note.");
        }
    };



    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    {currentFolder ? (
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => setCurrentFolder(null)}
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-mono"
                            >
                                <ArrowLeft size={14} /> Root
                            </button>
                            <span className="text-gray-600">/</span>
                            <span className="text-amber-500 font-mono font-bold">{currentFolder.name}</span>
                        </div>
                    ) : (
                        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                            The Scribe&apos;s Log
                        </h1>
                    )}
                    <p className="text-gray-400">
                        {currentFolder
                            ? `Viewing contents of ${currentFolder.name}`
                            : "Field notes from the battlefield. Reflect, learn, and grow."}
                    </p>
                    {!currentFolder && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span className="text-amber-500">💡 Tip:</span> Drag and drop your notes into folders to organize them.
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {!currentFolder && (
                        <button
                            onClick={() => setIsCreatingFolder(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 hover:border-amber-500/50 text-gray-300 hover:text-white font-medium rounded-xl transition-all"
                        >
                            <FolderPlus size={18} />
                            New Folder
                        </button>
                    )}
                    <Link
                        href={`/vault/notes/new${currentFolder ? `?folderId=${currentFolder.id}` : ''}`}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-900/20"
                    >
                        <Plus size={18} />
                        New Entry
                    </Link>
                </div>
            </div>

            {/* Create Folder Input */}
            {isCreatingFolder && (
                <div className="flex items-center gap-2 p-4 bg-gray-900/50 border border-gray-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <Folder size={20} className="text-amber-500" />
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder Name..."
                        className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 flex-1"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                    <button onClick={() => setIsCreatingFolder(false)} className="text-gray-500 hover:text-white">Cancel</button>
                    <button onClick={handleCreateFolder} className="text-amber-500 hover:text-amber-400 font-bold">Create</button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-900/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Folders Grid (Only show in root) */}
                        {!currentFolder && folders.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {folders.map(folder => (
                                    <div
                                        key={folder.id}
                                        onClick={() => setCurrentFolder(folder)}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.classList.add('border-amber-500', 'bg-gray-800');
                                        }}
                                        onDragLeave={(e) => {
                                            e.currentTarget.classList.remove('border-amber-500', 'bg-gray-800');
                                        }}
                                        onDrop={async (e) => {
                                            e.preventDefault();
                                            e.currentTarget.classList.remove('border-amber-500', 'bg-gray-800');
                                            const entryId = e.dataTransfer.getData('text/plain');
                                            if (entryId) {
                                                await handleMoveEntry(entryId, folder.id);
                                            }
                                        }}
                                        className="group bg-gray-900 border border-gray-800 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-32 relative"
                                    >
                                        <div className="flex justify-between items-start pointer-events-none">
                                            <Folder size={32} className="text-amber-600 group-hover:text-amber-500 transition-colors" />
                                            <button
                                                onClick={(e) => handleDeleteFolder(e, folder.id)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all p-1 pointer-events-auto"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="pointer-events-none">
                                            <h3 className="font-bold text-gray-200 truncate">{folder.name}</h3>
                                            <p className="text-xs text-gray-500">{folder._count?.entries || 0} items</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Entries List */}
                        <div className="space-y-4">
                            {entries.length === 0 && (folders.length === 0 || currentFolder) ? (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                                    <Calendar size={48} className="mb-4 opacity-20" />
                                    <p>No entries found here.</p>
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', entry.id);
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        onClick={() => router.push(`/vault/notes/${entry.id}`)}
                                        className="group bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-all cursor-pointer p-0 flex flex-col active:cursor-grabbing hover:shadow-lg hover:shadow-black/50"
                                    >
                                        <div className="p-3 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center h-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-3 bg-amber-500"></div>
                                                <span className="text-gray-300 font-mono text-xs font-bold">
                                                    {format(new Date(entry.date), 'dd MMM yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Remove from Folder Button */}
                                                {currentFolder && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMoveEntry(entry.id, null);
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove from Folder"
                                                    >
                                                        <FolderMinus size={14} />
                                                    </button>
                                                )}

                                                {entry.rating && entry.rating > 0 && (
                                                    <div className="flex gap-0.5">
                                                        {[...Array(entry.rating)].map((_, i) => (
                                                            <Star key={i} size={10} className="text-amber-500" fill="currentColor" />
                                                        ))}
                                                    </div>
                                                )}
                                                {entry.mood && (
                                                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 border-l border-gray-700 pl-2">
                                                        {entry.mood}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <p className="text-gray-400 line-clamp-2 text-xs leading-relaxed font-mono">
                                                {entry.content}
                                            </p>
                                        </div>

                                        <div className="px-3 pb-3 flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {entry.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] text-gray-600 bg-gray-950 border border-gray-800 px-1 py-0.5">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20 transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <div className="p-2 bg-red-900/20 rounded-full">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Delete Folder?</h3>
                        </div>

                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to delete this folder? <br />
                            <span className="text-red-400 font-bold text-sm bg-red-950/30 px-2 py-0.5 rounded border border-red-900/30 mt-2 inline-block">
                                ⚠ This will also delete all notes inside it.
                            </span>
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteFolder}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
