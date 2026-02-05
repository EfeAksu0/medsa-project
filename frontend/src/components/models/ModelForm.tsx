'use client';

import { useState } from 'react';
import { ModelFormData } from '@/types/trading';

interface ModelFormProps {
    onSubmit: (data: ModelFormData) => void;
    isSubmitting: boolean;
}

export function ModelForm({ onSubmit, isSubmitting }: ModelFormProps) {
    const [formData, setFormData] = useState<ModelFormData>({
        name: '',
        symbol: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model/Strategy Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., ICT SMC, Breakout Strategy"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Symbol/Instrument (Optional)
                </label>
                <input
                    type="text"
                    value={formData.symbol || ''}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value || null })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., EURUSD, AAPL"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors"
                >
                    {isSubmitting ? 'Creating...' : 'Create Model'}
                </button>
            </div>
        </form>
    );
}
