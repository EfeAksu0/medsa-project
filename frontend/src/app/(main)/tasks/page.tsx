'use client';

import { ToDoWidget } from '@/components/dashboard/ToDoWidget';

export default function TasksPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pre-Trade Protocol</h1>
                    <p className="text-gray-400">Manage your daily rules and routines</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Main List */}
                <div className="h-full">
                    <ToDoWidget />
                </div>

                {/* Context/Instructions (Placeholder for future stats) */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Why Protocols Matter</h2>
                    <div className="prose prose-invert text-sm text-gray-400">
                        <p>
                            Consistency is the edge. By defining a strict set of rules before you engage the market,
                            you separate your <strong>Logic</strong> from your <strong>Emotions</strong>.
                        </p>
                        <ul className="list-disc pl-4 space-y-2 mt-4">
                            <li>Review high-impact news events.</li>
                            <li>Check your mental state (HALT: Hungry, Angry, Lonely, Tired?).</li>
                            <li>Verify your daily loss limit.</li>
                            <li>Review yesterday&apos;s mistakes.</li>
                        </ul>
                        <p className="mt-4 text-amber-400 italic">
                            &quot;Amateurs look for entries. Professionals follow processes.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
