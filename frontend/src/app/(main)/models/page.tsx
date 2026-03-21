'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Model, ModelFormData } from '@/types/trading';
import { Plus, TrendingUp, Target, BarChart3, Trash2, Brain, AlertTriangle } from 'lucide-react';
import { QuickDelete } from '@/components/ui/QuickDelete';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { ModelForm } from '@/components/models/ModelForm';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ModelsPage() {
    const { data: models = [], isLoading, mutate: mutateModels } = useSWR<Model[]>('/models', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ModelFormData) => {
        try {
            setIsSubmitting(true);
            await api.post('/models', data);
            setIsModalOpen(false);
            mutateModels();
        } catch (error) {
            console.error('Failed to create model', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteModel = async (id: string) => {
        const previousModels = models;
        mutateModels(models.filter(m => m.id !== id), false);

        try {
            await api.delete(`/models/${id}`);
            toast.success('Model deleted');
            mutateModels();
        } catch (error) {
            console.error('Failed to delete model', error);
            toast.error('Failed to delete model');
            mutateModels(previousModels);
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

            {isLoading && models.length === 0 ? (
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
                                <QuickDelete
                                    onDelete={() => handleDeleteModel(model.id)}
                                    iconSize={15}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Trading Model">
                <ModelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Modal>


        </div>
    );
}
