'use client';

import { useState } from 'react';

export default function ContentCreatorPage() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Content for Day 2: Greed
    const scenes = [
        {
            duration: 2000,
            type: 'hook',
            text: 'My AI just called me out for being greedy',
            subtext: 'Day 2/30',
            background: 'from-purple-900 to-black'
        },
        {
            duration: 3000,
            type: 'setup',
            text: 'I had a winner. $300 up.',
            subtext: 'But I wanted MORE',
            background: 'from-green-900 to-black',
            emoji: '💰'
        },
        {
            duration: 3000,
            type: 'warning',
            text: '⚠️ GREED DETECTED',
            subtext: '"You\'re getting greedy. Take the profit."',
            background: 'from-orange-900 to-black',
            highlight: true
        },
        {
            duration: 2000,
            type: 'action',
            text: 'I listened.',
            subtext: 'Closed at $300',
            background: 'from-blue-900 to-black',
            emoji: '✅'
        },
        {
            duration: 2000,
            type: 'result',
            text: 'Market reversed 5 minutes later',
            subtext: 'AI saved me',
            background: 'from-green-900 to-black',
            emoji: '🎯'
        }
    ];

    const startPlayback = () => {
        setCurrentScene(0);
        setIsPlaying(true);

        let totalTime = 0;
        scenes.forEach((scene, index) => {
            setTimeout(() => {
                setCurrentScene(index);
            }, totalTime);
            totalTime += scene.duration;
        });

        // Stop at the end
        setTimeout(() => {
            setIsPlaying(false);
        }, totalTime);
    };

    const scene = scenes[currentScene];

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">
            {/* Day counter */}
            <div className="absolute top-4 left-4 z-50 bg-purple-600/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="text-white font-bold text-sm">DAY 2/30</div>
            </div>

            {/* Logo */}
            <div className="absolute top-4 right-4 z-50 opacity-60">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    MEDYSA
                </div>
            </div>

            {/* Current Scene */}
            {scene && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 bg-gradient-to-b ${scene.background} animate-fade-in`}>
                    {/* Main text */}
                    <div className={`text-4xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-2xl ${scene.highlight ? 'animate-pulse border-4 border-yellow-400 px-6 py-4 rounded-2xl bg-yellow-400/10' : ''}`}>
                        {scene.text}
                    </div>

                    {/* Subtext */}
                    {scene.subtext && (
                        <div className="text-2xl md:text-4xl text-gray-300 text-center">
                            {scene.subtext}
                        </div>
                    )}

                    {/* Emoji */}
                    {scene.emoji && (
                        <div className="mt-6 text-6xl animate-bounce-slow">
                            {scene.emoji}
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
                <button
                    onClick={startPlayback}
                    disabled={isPlaying}
                    className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                >
                    {isPlaying ? 'Playing...' : 'Start Recording'}
                </button>

                {!isPlaying && currentScene > 0 && (
                    <button
                        onClick={() => {
                            setCurrentScene(0);
                            setIsPlaying(false);
                        }}
                        className="bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700 font-bold text-lg"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Instructions */}
            {!isPlaying && currentScene === 0 && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg max-w-md">
                    <div className="text-white text-center">
                        <div className="font-bold mb-2">📹 How to Record:</div>
                        <div className="text-sm space-y-1">
                            <div>1. Press &quot;Start Recording&quot;</div>
                            <div>2. Press Win+Alt+R to start screen recording</div>
                            <div>3. Reel plays automatically (12 seconds)</div>
                            <div>4. Press Win+Alt+R to stop recording</div>
                            <div>5. Add your voiceover in CapCut</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress indicator */}
            {isPlaying && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                    {scenes.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentScene
                                ? 'bg-purple-500 scale-125'
                                : index < currentScene
                                    ? 'bg-purple-700'
                                    : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
