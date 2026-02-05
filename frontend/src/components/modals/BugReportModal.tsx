import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';

interface BugReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/bugs', { description, steps });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setDescription('');
                setSteps('');
            }, 2000);
        } catch (err) {
            console.error('Failed to submit bug report', err);
            setError('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-gray-900 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                    <Bug size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white font-serif">Report a Bug</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {success ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Report Received</h3>
                                    <p className="text-gray-400">Thank you for helping us sharpen the blade.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            What happened? <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-gray-600 resize-none"
                                            placeholder="Describe the issue..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Steps to Reproduce (Optional)
                                        </label>
                                        <textarea
                                            value={steps}
                                            onChange={(e) => setSteps(e.target.value)}
                                            className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-gray-600 resize-none"
                                            placeholder="1. Go to page...&#10;2. Click button..."
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                                            <ShieldAlert size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Submit Report'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
