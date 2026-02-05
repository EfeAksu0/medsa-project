'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Account, AccountFormData } from '@/types/trading';
import { Plus, TrendingUp, Target, Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { AccountForm } from '@/components/accounts/AccountForm';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error('Failed to fetch accounts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleAddAccount = () => {
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (data: AccountFormData) => {
        try {
            setIsSubmitting(true);
            await api.post('/accounts', data);
            setIsAddModalOpen(false);
            fetchAccounts(); // Refresh list
        } catch (error) {
            console.error('Failed to create account', error);
            alert('Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!accountToDelete) return;

        console.log('Deleting account:', accountToDelete);
        setIsSubmitting(true);

        // Optimistic update - remove immediately
        const previousAccounts = accounts;
        setAccounts(prev => prev.filter(a => a.id !== accountToDelete));

        try {
            await api.delete(`/accounts/${accountToDelete}`);
            console.log('Account deleted successfully');
            setIsDeleteModalOpen(false);
            setAccountToDelete(null);
        } catch (error) {
            console.error('Failed to delete account', error);
            // Revert on failure
            setAccounts(previousAccounts);
            alert('Failed to delete account');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setAccountToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const getProgressPercent = (current: number, goal?: number | null) => {
        if (!goal) return 0;
        return Math.min((current / goal) * 100, 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Accounts</h1>
                <button
                    onClick={handleAddAccount}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Account</span>
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400">Loading accounts...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-400">
                                        {account.type}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteClick(e, account.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-gray-800 z-10 relative"
                                    title="Delete Account"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Balance */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-400">Balance</span>
                                        <span className="text-white font-semibold">
                                            ${(Number(account.currentBalance) + (account.netPnL || 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    {account.goalBalance && (
                                        <>
                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${getProgressPercent(Number(account.currentBalance) + (account.netPnL || 0), Number(account.goalBalance))}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Goal: ${Number(account.goalBalance).toLocaleString()}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                                    <div>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                                            <TrendingUp size={12} />
                                            <span>Win Rate</span>
                                        </div>
                                        <div className="text-lg font-semibold text-white">
                                            {account.winRate?.toFixed(1) || '0.0'}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                                            <Target size={12} />
                                            <span>Net P&L</span>
                                        </div>
                                        <div className={`text-lg font-semibold ${(account.netPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {(account.netPnL || 0) >= 0 ? '+' : ''}${account.netPnL?.toFixed(2) || '0.00'}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                                    {account.totalTrades || 0} total trades
                                </div>
                            </div>
                        </div>
                    ))}

                    {accounts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No accounts yet. Create one to get started!
                        </div>
                    )}
                </div>
            )}

            {/* Add Account Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="New Account"
            >
                <AccountForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                        <div className="space-y-1">
                            <h4 className="font-semibold text-red-500">Are you sure?</h4>
                            <p className="text-sm text-gray-400">
                                This action cannot be undone. All trades associated with this account will be permanently deleted.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <span>Deleting...</span>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    <span>Delete Account</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
