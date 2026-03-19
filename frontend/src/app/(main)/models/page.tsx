'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Model, ModelFormData } from '@/types/trading';
import { Plus, TrendingUp, Target, BarChart3, Trash2, Brain, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ModelForm } from '@/components/models/ModelForm';
import { cn } from '@/lib/utils';

export default function ModelsPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modelToDelete, setModelToDelete] = useState<{ id: string, name: string } | null>(null);

    const fetchModels = async () => {
        try {
            setLoading(true);
            const res = await api.get('/models');
            setModels(res.data);
        } catch (error) {
            console.error('Failed to fetch models', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchModels(); }, []);

    const handleSubmit = async (data: ModelFormData) => {
        try {
            setIsSubmitting(true);
            await api.post('/models', data);
            setIsModalOpen(false);
            fetchModels();
        } catch (error) {
            console.error('Failed to create model', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteModel = async () => {
        if (!modelToDelete) return;
        try {
            await api.delete(`/models/${modelToDelete.id}`);
            setModels(models.filter(m => m.id !== modelToDelete.id));
            setIsDeleteModalOpen(false);
            setModelToDelete(null);
        } catch (error) {
            console.error('Failed to delete model', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Trading Models</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and compare your trading strategies</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-900/20"
                >
                    <Plus size={18} />
                    Add Model
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />)}
                </div>
            ) : models.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30 text-center gap-3">
                    <Brain size={40} className="text-gray-700" />
                    <p className="text-gray-500 font-medium">No models yet</p>
                    <p className="text-gray-600 text-sm">Create a trading model to track your strategy performance</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-2 text-amber-500 hover:text-amber-400 text-sm font-semibold flex items-center gap-1">
                        <Plus size={14} /> Add Model
                    </button>
                </div>
            ) : (
                <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-800/80 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                        <span>Model</span>
                        <span>Symbol</span>
                        <span>Win Rate</span>
                        <span>Trades</span>
                        <span>W / L / BE</span>
                        <span>Avg SL</span>
                        <span>Avg R:R</span>
                        <span>Max R:R</span>
                        <span></span>
                    </div>

                    {/* Rows */}
                    {models.map((model, idx) => {
                        const wr = model.winRate || 0;
                        return (
                            <div
                                key={model.id}
                                className={cn(
                                    "grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center transition-colors group",
                                    "hover:bg-white/[0.03]",
                                    idx !== models.length - 1 && "border-b border-gray-800/40"
                                )}
                            >
                                <span className="text-white font-semibold text-sm truncate">{model.name}</span>
                                <span className="text-gray-400 text-sm">{model.symbol || <span className="text-gray-700">—</span>}</span>
                                <span className={cn("text-sm font-bold", wr >= 50 ? 'text-green-400' : 'text-red-400')}>
                                    {wr.toFixed(1)}%
                                </span>
                                <span className="text-gray-300 text-sm">{model.totalTrades || 0}</span>
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <span className="text-green-400">{model.wins || 0}W</span>
                                    <span className="text-gray-700">/</span>
                                    <span className="text-red-400">{model.losses || 0}L</span>
                                    <span className="text-gray-700">/</span>
                                    <span className="text-amber-400">{model.breakevens || 0}BE</span>
                                </div>
                                <span className="text-gray-400 text-sm">{model.avgSL?.toFixed(2) || <span className="text-gray-700">—</span>}</span>
                                <span className="text-gray-400 text-sm">{model.avgRR?.toFixed(2) || <span className="text-gray-700">—</span>}</span>
                                <span className="text-blue-400 font-semibold text-sm">{model.maxRR?.toFixed(2) || <span className="text-gray-700">—</span>}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModelToDelete({ id: model.id, name: model.name });
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Trading Model">
                <ModelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Model">
                <div className="space-y-5">
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-semibold text-red-400 text-sm">Delete <span className="text-white">{modelToDelete?.name}</span>?</p>
                            <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm">Cancel</button>
                        <button onClick={handleDeleteModel} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                            <Trash2 size={15} />
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
