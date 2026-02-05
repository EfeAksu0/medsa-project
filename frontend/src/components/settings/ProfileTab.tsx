'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api, { uploadImage, API_URL } from '@/lib/api';
import { User, Shield, Camera, Lock, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

export function ProfileTab() {
    const { user, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isUploading, setIsUploading] = useState(false);

    // If user has an avatarUrl, it might be a relative path from our upload route
    const displayAvatar = avatarUrl
        ? (avatarUrl.startsWith('http') ? avatarUrl : `${API_URL.replace('/api', '')}${avatarUrl}`)
        : null;

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        try {
            setIsUploading(true);
            const file = e.target.files[0];
            const url = await uploadImage(file);
            setAvatarUrl(url); // Optimistic update
        } catch (error) {
            console.error('Avatar upload failed', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
            // reset input
            e.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const payload: any = { name };
            if (password) payload.password = password;
            if (avatarUrl) payload.avatarUrl = avatarUrl;

            const res = await api.put('/auth/me', payload);

            // Update local context
            // We reuse login() to refresh user data without token change if token not returned, 
            // but login() expects token. 
            // Actually, we should expose a 'refreshUser' or similar in AuthContext, 
            // but calling login with existing token works if we just want to update state.
            // Or better, just wait for page refresh or do nothing if context doesn't support update.
            // For now, let's just alert success.
            // Ideally, we re-fetch user.

            // Hacky context update:
            const token = localStorage.getItem('token');
            if (token) login(token, res.data.user);

            alert('Profile updated successfully!');
            setPassword(''); // Clear password field
        } catch (error: any) {
            console.error('Update failed', error);
            alert(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-amber-600/30 overflow-hidden flex items-center justify-center relative">
                        {displayAvatar ? (
                            <img
                                src={displayAvatar}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="text-gray-500 w-12 h-12" />
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="animate-spin text-amber-500" />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-amber-600 text-white rounded-full cursor-pointer hover:bg-amber-500 transition-colors shadow-lg border-2 border-gray-900">
                        <Camera size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
                    </label>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">{user?.name || 'Unknown Knight'}</h3>
                    <p className="text-gray-500 text-sm italic">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-white/5">
                        <Shield size={12} className={user?.tier === 'MEDYSA_AI' ? 'text-purple-400' : 'text-amber-500'} />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{user?.tier?.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                        placeholder="Sir Lancelot"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">New Password (Optional)</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                            placeholder="To change, type new password"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
