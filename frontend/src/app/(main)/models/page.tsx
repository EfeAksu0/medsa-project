'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Model, ModelFormData } from '@/types/trading';
import { Plus, TrendingUp, Target, BarChart3, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ModelForm } from '@/components/models/ModelForm';

export default function ModelsPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal State
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

    useEffect(() => {
        fetchModels();
    }, []);

    const handleAddModel = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: ModelFormData) => {
        try {
            setIsSubmitting(true);
            await api.post('/models', data);
            setIsModalOpen(false);
            fetchModels(); // Refresh list
        } catch (error) {
            console.error('Failed to create model', error);
            alert('Failed to create model');
        } finally {
            setIsSubmitting(false);
        }
    };



    const confirmDelete = (model: { id: string, name: string }) => {
        setModelToDelete(model);
        setIsDeleteModalOpen(true);
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
            alert('Failed to delete model');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Trading Models</h1>
                <button
                    onClick={handleAddModel}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Model</span>
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400">Loading models...</div>
            ) : (
                <div className="bg-gray-900 rounded-lg border border-gray-800/50 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-800/50">
                            <tr className="text-xs text-gray-400">
                                <th className="px-4 py-3 font-medium">Model Name</th>
                                <th className="px-4 py-3 font-medium">Symbol</th>
                                <th className="px-4 py-3 font-medium">Win Rate</th>
                                <th className="px-4 py-3 font-medium">Total Trades</th>
                                <th className="px-4 py-3 font-medium">W/L/BE</th>
                                <th className="px-4 py-3 font-medium">Avg SL</th>
                                <th className="px-4 py-3 font-medium">Avg R:R</th>
                                <th className="px-4 py-3 font-medium">Max R:R</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model) => (
                                <tr
                                    key={model.id}
                                    className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <span className="text-white font-medium">{model.name}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                        {model.symbol || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-semibold ${(model.winRate || 0) >= 50 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {model.winRate?.toFixed(1) || '0.0'}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                        {model.totalTrades || 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-green-400">{model.wins || 0}W</span>
                                            <span className="text-gray-500">/</span>
                                            <span className="text-red-400">{model.losses || 0}L</span>
                                            <span className="text-gray-500">/</span>
                                            <span className="text-yellow-400">{model.breakevens || 0}BE</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                        {model.avgSL?.toFixed(2) || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                        {model.avgRR?.toFixed(2) || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-blue-400 font-medium">
                                            {model.maxRR?.toFixed(2) || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete({ id: model.id, name: model.name });
                                            }}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg cursor-pointer z-50 relative"
                                            title="Delete Model"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {models.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No trading models yet. Create one to track strategy performance!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Trading Model"
            >
                <ModelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Model"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Are you sure you want to delete <span className="text-white font-bold">{modelToDelete?.name}</span>?
                        <br />
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteModel}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Delete Model
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
