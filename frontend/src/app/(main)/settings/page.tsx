'use client';

import { useState } from 'react';
import { User, CreditCard, Database, Settings as SettingsIcon } from 'lucide-react';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { BillingTab } from '@/components/settings/BillingTab';
import { DataManagementTab } from '@/components/settings/DataManagementTab';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<'profile' | 'billing' | 'data'>('profile');

    return (
        <div className="flex flex-col lg:flex-row min-h-[80vh] gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-8 space-y-2">
                    <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <SettingsIcon className="text-amber-500" />
                        Settings
                    </h1>

                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => setActiveSection('profile')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${activeSection === 'profile' ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <User size={18} />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveSection('billing')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${activeSection === 'billing' ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <CreditCard size={18} />
                            Billing & Plan
                        </button>
                        <button
                            onClick={() => setActiveSection('data')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${activeSection === 'data' ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Database size={18} />
                            Data Management
                        </button>
                    </nav>

                    <div className="pt-8 mt-8 border-t border-gray-800">
                        <p className="text-xs text-gray-600 px-4">
                            Medysa Trading v1.0.2<br />
                            Build 2026.01.23
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 lg:p-10 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                {activeSection === 'profile' && <ProfileTab />}
                {activeSection === 'billing' && <BillingTab />}
                {activeSection === 'data' && <DataManagementTab />}
            </div>
        </div>
    );
}
