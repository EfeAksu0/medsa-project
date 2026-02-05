'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AccountFormData } from '@/types/trading';

interface AccountFormProps {
    onSubmit: (data: AccountFormData) => void;
    isSubmitting: boolean;
}

export function AccountForm({ onSubmit, isSubmitting }: AccountFormProps) {
    const [formData, setFormData] = useState<AccountFormData>({
        name: '',
        type: 'LIVE',
        currentBalance: 0,
        goalBalance: null,
    });
    const [showTypes, setShowTypes] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Live Account"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type *
                </label>
                <div className="relative group account-type-container">
                    <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        onFocus={() => setShowTypes(true)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Select or type custom (e.g. Challenge)"
                        required
                    />

                    {showTypes && (
                        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                            {['LIVE', 'DEMO', 'FUNDED', 'CHALLENGE', 'EVALUATION'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type });
                                        setShowTypes(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Balance *
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({ ...formData, currentBalance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Goal Balance (Optional)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={formData.goalBalance || ''}
                    onChange={(e) => setFormData({ ...formData, goalBalance: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors"
                >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
            </div>
        </form >
    );
}
