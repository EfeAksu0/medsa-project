'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Trade } from '@/types/trade';
import { Account, Model } from '@/types/trading';
import { Modal } from '@/components/ui/Modal';

interface TrashData {
    trades: Trade[];
    accounts: Account[];
    models: Model[];
}

export function DataManagementTab() {
    const [trashData, setTrashData] = useState<TrashData>({ trades: [], accounts: [], models: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'trades' | 'accounts' | 'models'>('trades');

    // Deletion Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchTrash = async () => {
        try {
            setLoading(true);
            const res = await api.get('/trash');
            setTrashData(res.data);
        } catch (error) {
            console.error('Failed to fetch trash data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (type: string, id: string) => {
        try {
            await api.post('/trash/restore', { type, id });
            setTrashData(prev => ({
                ...prev,
                [type + 's']: (prev[type + 's' as keyof TrashData] as { id: string }[]).filter(item => item.id !== id)
            }));
            // Optional: toast success
        } catch (error) {
            console.error('Failed to restore item', error);
            alert('Failed to restore');
        }
    };

    const handleDeleteClick = (type: string, id: string) => {
        setItemToDelete({ type, id });
        setIsDeleteModalOpen(true);
    };

    const confirmPermanentDelete = async () => {
        if (!itemToDelete) return;

        try {
            setIsDeleting(true);
            const { type, id } = itemToDelete;
            await api.delete('/trash', { data: { type, id } });

            setTrashData(prev => ({
                ...prev,
                [type + 's']: (prev[type + 's' as keyof TrashData] as { id: string }[]).filter(item => item.id !== id)
            }));

            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Failed to delete item', error);
            alert('Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/40">
                <div className="border-b border-gray-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Trash2 className="text-gray-400" size={20} />
                        <h2 className="text-lg font-semibold text-white">Trash Can</h2>
                    </div>
                    <p className="text-sm text-gray-500">Restore deleted items or permanently remove them.</p>
                </div>

                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('trades')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'trades' ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                    >
                        Trades ({trashData.trades.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'accounts' ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                    >
                        Accounts ({trashData.accounts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('models')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'models' ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                    >
                        Models ({trashData.models.length})
                    </button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {trashData[activeTab].length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No deleted {activeTab} found
                                </div>
                            ) : (
                                trashData[activeTab].map((item: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-800/50 hover:bg-gray-800 transition-colors">
                                        <div>
                                            {activeTab === 'trades' && (
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{item.instrument} {item.direction}</span>
                                                    <span className="text-xs text-gray-500">{item.tradeDate} • {item.result}</span>
                                                </div>
                                            )}
                                            {activeTab === 'accounts' && (
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{item.name}</span>
                                                    <span className="text-xs text-gray-500">{item.type} • ${Number(item.currentBalance).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {activeTab === 'models' && (
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{item.name}</span>
                                                    <span className="text-xs text-gray-500">{item.symbol || 'No symbol'}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRestore(activeTab.slice(0, -1), item.id)}
                                                className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                                title="Restore"
                                            >
                                                <RotateCcw size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(activeTab.slice(0, -1), item.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Permanent Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Permanently"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                        <div className="space-y-1">
                            <h4 className="font-semibold text-red-500">Are you sure?</h4>
                            <p className="text-sm text-gray-400">
                                This action cannot be undone. This item will be permanently removed from the database.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmPermanentDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <span>Deleting...</span>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    <span>Delete Forever</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
