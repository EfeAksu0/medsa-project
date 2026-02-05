'use client';

import { AiCoach } from '@/components/AiCoach';

export default function AiCoachPage() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1
                        className="text-4xl font-black text-white mb-2"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        Your AI Coach
                    </h1>
                    <p className="text-gray-400">
                        Let&apos;s talk about your trading mindset and performance
                    </p>
                </div>

                <div className="h-[calc(100vh-200px)]">
                    <AiCoach />
                </div>
            </div>
        </div>
    );
}
