'use client';

import { useEffect, useState } from 'react';
import { Zap, MapPin, Clock } from 'lucide-react';

const SIGNUP_ACTIVITIES = [
    { name: 'Marcus T.', location: 'New York', plan: 'Medysa AI', timeAgo: 'Just now' },
    { name: 'Sarah K.', location: 'London', plan: 'Knighthood', timeAgo: '2 min ago' },
    { name: 'David R.', location: 'Singapore', plan: 'Medysa AI', timeAgo: '3 min ago' },
    { name: 'Elena P.', location: 'Dubai', plan: 'Medysa AI', timeAgo: '5 min ago' },
    { name: 'James W.', location: 'Toronto', plan: 'Knighthood', timeAgo: '7 min ago' },
    { name: 'Yuki M.', location: 'Tokyo', plan: 'Medysa AI', timeAgo: '9 min ago' },
    { name: 'Alex S.', location: 'Berlin', plan: 'Knighthood', timeAgo: '12 min ago' },
    { name: 'Sofia L.', location: 'Madrid', plan: 'Medysa AI', timeAgo: '14 min ago' },
];

export function LiveActivityFeed() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % SIGNUP_ACTIVITIES.length);
                setIsVisible(true);
            }, 300);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const activity = SIGNUP_ACTIVITIES[currentIndex];
    const isPremium = activity.plan === 'Medysa AI';

    return (
        <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${isPremium
                ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                : 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
            } ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isPremium ? 'bg-purple-500' : 'bg-amber-500'}`}></div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                    <Zap size={14} className={isPremium ? 'text-purple-400' : 'text-amber-400'} />
                    <span className="text-sm font-bold text-white">{activity.name}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                        <MapPin size={12} />
                        <span>{activity.location}</span>
                    </div>

                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPremium
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                        {activity.plan}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={12} />
                        <span>{activity.timeAgo}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
