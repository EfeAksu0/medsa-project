'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Account, AccountFormData } from '@/types/trading';
import { Plus, TrendingUp, Target, Trash2, AlertTriangle, Wallet, ChevronRight } from 'lucide-react';
import { QuickDelete } from '@/components/ui/QuickDelete';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { AccountForm } from '@/components/accounts/AccountForm';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function AccountsPage() {
    const { data: accounts = [], isLoading, mutate: mutateAccounts } = useSWR<Account[]>('/accounts', fetcher);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: AccountFormData) => {
        try {
            setIsSubmitting(true);
            await api.post('/accounts', data);
            setIsAddModalOpen(false);
            mutateAccounts();
        } catch (error) {
            console.error('Failed to create account', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccountDelete = async (id: string) => {
        const prev = accounts;
        mutateAccounts(accounts.filter(a => a.id !== id), false);
        try {
            await api.delete(`/accounts/${id}`);
            toast.success('Account deleted');
            mutateAccounts();
        } catch (error) {
            console.error('Failed to delete account', error);
            toast.error('Failed to delete account');
            mutateAccounts(prev);
        }
    };

    const getProgress = (current: number, goal?: number | null) =>
        goal ? Math.min((current / goal) * 100, 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Accounts</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your trading accounts and performance</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-900/20"
                >
                    <Plus size={18} />
                    Add Account
                </button>
            </div>

            {isLoading && accounts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2].map(i => <div key={i} className="h-52 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />)}
                </div>
            ) : accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30 text-center gap-3">
                    <Wallet size={40} className="text-gray-700" />
                    <p className="text-gray-500 font-medium">No accounts yet</p>
                    <p className="text-gray-600 text-sm">Add your first account to start tracking performance</p>
                    <button onClick={() => setIsAddModalOpen(true)} className="mt-2 text-amber-500 hover:text-amber-400 text-sm font-semibold flex items-center gap-1">
                        <Plus size={14} /> Add Account
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {accounts.map((account) => {
                        const balance = Number(account.currentBalance) + (account.netPnL || 0);
                        const progress = getProgress(balance, Number(account.goalBalance));
                        const isProfit = (account.netPnL || 0) >= 0;

                        return (
                            <div key={account.id} className="bg-gray-900/60 border border-gray-800/60 hover:border-gray-700 rounded-2xl p-5 transition-all group backdrop-blur-sm hover:shadow-lg hover:-translate-y-0.5">
                                {/* Top Row */}
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h3 className="text-base font-bold text-white">{account.name}</h3>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wide">
                                            {account.type}
                                        </span>
                                    </div>
                                    <QuickDelete
                                        onDelete={() => handleAccountDelete(account.id)}
                                        iconSize={15}
                                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5"
                                    />
                                </div>

                                {/* Balance */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                                    <p className="text-2xl font-bold text-white">
                                        ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    {account.goalBalance && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                                                <div
                                                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-1">{progress.toFixed(0)}% to goal (${Number(account.goalBalance).toLocaleString()})</p>
                                        </div>
                                    )}
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800/60">
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Win Rate</p>
                                        <p className={cn("text-base font-bold", (account.winRate || 0) >= 50 ? 'text-green-400' : 'text-red-400')}>
                                            {account.winRate?.toFixed(1) || '0.0'}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Net P&L</p>
                                        <p className={cn("text-base font-bold", isProfit ? 'text-green-400' : 'text-red-400')}>
                                            {isProfit ? '+' : ''}${(account.netPnL || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Trades</p>
                                        <p className="text-base font-bold text-white">{account.totalTrades || 0}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Account">
                <AccountForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Modal>


        </div>
    );
}
