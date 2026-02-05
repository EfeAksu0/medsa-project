'use client';

import { useState, useEffect } from 'react';

const scripts = {
    psychology: {
        scenes: [
            { visual: '📉 Red Account', text: "You keep losing money...", duration: 2, tip: 'Show red P/L or chart', voiceover: '"Same mistakes, different day"', transition: 'Zoom in' },
            { visual: '🧠 The Problem', text: "Because of your PSYCHOLOGY", duration: 3, tip: 'Text overlay with emphasis', voiceover: '"Not your strategy. Your mind."', transition: 'Shake' },
            { visual: '😰 Emotions', text: "Fear. Greed. Revenge.", duration: 2, tip: 'Show emotions visually', voiceover: '"The silent account killers"', transition: 'Flash' },
            { visual: '🤖 The Solution', text: "Get your psychological trading AI now", duration: 3, tip: 'Show Medysa AI interface', voiceover: '"AI that fixes your mindset"', transition: 'Swipe up' },
            { visual: '🔗 CTA', text: "Free your mind. Save your account.", duration: 2, tip: 'Logo + link text', voiceover: 'None', transition: 'Fade' }
        ]
    },
    revenge: {
        scenes: [
            { visual: '📱 Dashboard', text: "When you're about to revenge trade...", duration: 2, tip: 'Show your dashboard with red P/L', voiceover: '"I just lost $200 and I want it back NOW..."', transition: 'Zoom in' },
            { visual: '🤖 Open AI', text: 'But your AI coach reminds you:', duration: 2, tip: 'Click on Medysa AI chat icon', voiceover: '"But then I remembered my AI coach..."', transition: 'Swipe left' },
            { visual: '💬 AI Reply', text: "You're trading emotionally. Step away...", duration: 3, tip: 'Show the purple AI response appearing', voiceover: '"And it called me out HARD."', transition: 'Fade' },
            { visual: '✅ Close App', text: 'Saved $500 ✅', duration: 2, tip: 'Close app, lean back', voiceover: '"Best advice I ever took."', transition: 'Slide up' },
            { visual: '🔗 CTA', text: 'Get your AI coach - link in bio', duration: 2, tip: 'Show app logo or text', voiceover: 'None - let text speak', transition: 'None' }
        ]
    },
    tracking: {
        scenes: [
            { visual: '📄 Blank', text: 'Losing traders track this...', duration: 2, tip: 'Show empty Excel sheet', voiceover: '"Most traders only track P/L"', transition: 'Zoom out' },
            { visual: '📊 Excel', text: 'Just numbers...', duration: 2, tip: 'Show basic P/L column', voiceover: '"And wonder why they keep losing"', transition: 'Shake' },
            { visual: '✨ Medysa', text: 'Winners track THIS...', duration: 3, tip: 'Show Medysa journal with mood/tags', voiceover: '"But winners track their psychology"', transition: 'Zoom in' },
            { visual: '🎯 Features', text: 'Psychology + Data = Edge', duration: 2, tip: 'Highlight mood selector', voiceover: '"This changed everything for me"', transition: 'Swipe' },
            { visual: '🔗 CTA', text: 'Start tracking smarter 📊', duration: 2, tip: 'Show logo', voiceover: 'None', transition: 'None' }
        ]
    },
    brutal: {
        scenes: [
            { visual: '⌨️ Typing', text: 'Why did I lose today?', duration: 2, tip: 'Type in Medysa AI chat', voiceover: '"I asked my AI why I lost"', transition: 'None' },
            { visual: '⏳ Thinking', text: 'AI analyzing...', duration: 1, tip: 'Show loading/thinking state', voiceover: 'None', transition: 'Pulse' },
            { visual: '💀 Response', text: 'You violated rule #3...', duration: 3, tip: 'Show AI response', voiceover: '"The truth HURT"', transition: 'Pop in' },
            { visual: '😱 Reaction', text: "Can't lie to AI 💀", duration: 2, tip: 'Your shocked face or text', voiceover: '"But it was right..."', transition: 'Shake' },
            { visual: '🔗 CTA', text: 'Get brutally honest feedback', duration: 2, tip: 'Logo', voiceover: 'None', transition: 'None' }
        ]
    },
    pattern: {
        scenes: [
            { visual: '📊 Stats', text: 'I noticed a pattern in my losses...', duration: 2, tip: 'Show analytics', voiceover: '"After 30 trades, I saw it"', transition: 'Zoom' },
            { visual: '😰 Mood', text: 'All my worst trades had THIS in common', duration: 3, tip: 'Show mood tracker', voiceover: '"Anxious = -$1000"', transition: 'Highlight' },
            { visual: '🤖 AI', text: 'My AI coach spotted it first', duration: 2, tip: 'AI insight', voiceover: '"AI saw it before I did"', transition: 'Swipe' },
            { visual: '✅ Fix', text: 'Now I track psychology BEFORE P/L', duration: 2, tip: 'Journal entry', voiceover: '"Changed my entire approach"', transition: 'Fade' },
            { visual: '🔗 CTA', text: 'Track what actually matters', duration: 2, tip: 'Logo', voiceover: 'None', transition: 'None' }
        ]
    },
    demo: {
        scenes: [
            { visual: '📱 Open', text: 'Watch how fast this is...', duration: 2, tip: 'Open app', voiceover: '"30 seconds to log a trade"', transition: 'Swipe' },
            { visual: '➕ Add', text: 'Add trade with 1 tap', duration: 2, tip: 'Click add', voiceover: 'None', transition: 'Pop' },
            { visual: '📝 Fill', text: 'Chart upload + quick notes', duration: 3, tip: 'Fill form fast', voiceover: '"Upload chart, done"', transition: 'Fade' },
            { visual: '🤖 Ask', text: 'Ask AI for instant feedback', duration: 2, tip: 'AI response', voiceover: '"AI analyzes it live"', transition: 'Zoom' },
            { visual: '🔗 CTA', text: 'Start journaling smarter', duration: 2, tip: 'Logo', voiceover: 'None', transition: 'None' }
        ]
    }
};

export default function ReelCreatorPage() {
    const [currentScript, setCurrentScript] = useState('psychology');
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [animateText, setAnimateText] = useState(true);

    const scenes = scripts[currentScript as keyof typeof scripts].scenes;
    const currentScene = scenes[currentSceneIndex];

    useEffect(() => {
        // Reset animation on scene change
        setAnimateText(false);
        const timer = setTimeout(() => setAnimateText(true), 10);
        return () => clearTimeout(timer);
    }, [currentSceneIndex, currentScript]);

    const playAll = () => {
        let i = 0;
        const next = () => {
            if (i < scenes.length) {
                setCurrentSceneIndex(i);
                setTimeout(next, scenes[i].duration * 1000);
                i++;
            }
        };
        next();
    };

    return (
        <div className="page-container">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <h1>🎬 Medysa Pro Reel Creator</h1>
                    <p>Create viral TikTok/Instagram Reels with advanced features</p>
                </div>

                <div className="grid">
                    {/* Column 1: Selection */}
                    <div className="card">
                        <h2>📝 Choose Script</h2>
                        <select
                            value={currentScript}
                            onChange={(e) => {
                                setCurrentScript(e.target.value);
                                setCurrentSceneIndex(0);
                            }}
                        >
                            <option value="psychology">🧠 Stop Losing Money (Psychology)</option>
                            <option value="revenge">🎯 Revenge Trade Stopper</option>
                            <option value="tracking">📊 What Winners Track</option>
                            <option value="brutal">🤖 Brutal AI Coach</option>
                            <option value="pattern">🔄 Breaking Bad Patterns</option>
                            <option value="demo">✨ Live Demo</option>
                        </select>

                        <div className="space-y-3">
                            {scenes.map((scene, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentSceneIndex(index)}
                                    className={`scene ${currentSceneIndex === index ? 'active' : ''}`}
                                >
                                    <div className="scene-header">
                                        <span className="scene-number">Scene {index + 1}</span>
                                        <span className="scene-duration">{scene.duration}s</span>
                                    </div>
                                    <div className="scene-visual">{scene.visual}</div>
                                    <div className="scene-text">&quot;{scene.text}&quot;</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Preview */}
                    <div className="card">
                        <h2>👁️ Preview</h2>
                        <div className="preview">
                            <div className="preview-bg"></div>
                            <div className={`preview-text ${animateText ? 'animate' : ''}`}>
                                {currentScene.text}
                            </div>
                        </div>

                        <div className="controls">
                            <button className="btn btn-primary" onClick={playAll}>
                                ▶️ Play All
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentSceneIndex(0)}
                            >
                                🔄 Reset
                            </button>
                        </div>

                        <div className="tips">
                            <h4>🎬 Scene Tips</h4>
                            <ul>
                                <li><strong>Record:</strong> {currentScene.tip}</li>
                                <li><strong>Transition:</strong> {currentScene.transition}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Enhancements */}
                    <div className="card">
                        <h2>✨ Enhancements</h2>

                        <div className="feature-box">
                            <h4>🎤 Voice-Over</h4>
                            <p className="italic text-purple-200">{currentScene.voiceover}</p>
                        </div>

                        <div className="feature-box">
                            <h4>🔀 Transitions</h4>
                            <p>{currentScene.transition}</p>
                        </div>

                        <div className="feature-box">
                            <h4>🎨 Text Style</h4>
                            <p>
                                • Font: Montserrat Bold<br />
                                • Size: 60-80px<br />
                                • Animation: Pop + Bounce
                            </p>
                        </div>

                        <div className="tips mt-4">
                            <h4>💡 Pro Tip</h4>
                            <ul className="text-sm space-y-2">
                                <li>Use trending sounds</li>
                                <li>Match energy to message</li>
                                <li>Sync cuts to beat drops</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* Global Reset & Base Styles */
                .page-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: #0f0f0f;
                    color: #fff;
                    min-height: 100vh;
                    padding: 40px 20px;
                    position: relative;
                    overflow-x: hidden;
                }

                /* Animated Background */
                .page-container::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.15), transparent 25%),
                        radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.15), transparent 25%);
                    z-index: 0;
                    animation: backgroundFloat 20s ease-in-out infinite alternate;
                    pointer-events: none;
                }

                @keyframes backgroundFloat {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .header {
                    text-align: center;
                    margin-bottom: 50px;
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }

                .header h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
                }
                
                @media (min-width: 768px) {
                    .header h1 { font-size: 3.5rem; }
                }

                .header p {
                    font-size: 1.2rem;
                    color: #94a3b8;
                }

                .grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                    align-items: start;
                }

                @media (min-width: 1200px) {
                    .grid {
                        grid-template-columns: 350px 1fr 300px;
                    }
                }

                .card {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 30px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease;
                }

                .card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(124, 58, 237, 0.3);
                }

                .card h2 {
                    font-size: 1.4rem;
                    margin-bottom: 25px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                }

                select {
                    width: 100%;
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-bottom: 25px;
                    transition: all 0.3s;
                }

                select:focus {
                    outline: none;
                    border-color: #7c3aed;
                    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
                }

                .scene {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .scene::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background: #333;
                    transition: background 0.3s;
                }

                .scene:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(5px);
                }

                .scene.active {
                    background: linear-gradient(90deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%);
                    border-color: rgba(124, 58, 237, 0.3);
                }

                .scene.active::before {
                    background: #a855f7;
                    box-shadow: 0 0 10px #a855f7;
                }

                .scene-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    align-items: center;
                }

                .scene-number {
                    font-weight: 700;
                    color: #a855f7;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .scene-duration {
                    background: rgba(124, 58, 237, 0.2);
                    color: #d8b4fe;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .scene-visual {
                    color: #fbbf24;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .scene-text {
                    color: #e2e8f0;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .preview {
                    background: #000;
                    border-radius: 24px;
                    width: 320px;
                    height: 569px;
                    min-width: 320px;
                    min-height: 569px;
                    margin: 0 auto 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    border: 8px solid #1a1a1a;
                    flex-shrink: 0;
                }

                .preview-text {
                    padding: 40px;
                    text-align: center;
                    font-size: 2rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    line-height: 1.1;
                    opacity: 0;
                    z-index: 2;
                    /* Animated Gradient Text */
                    background: linear-gradient(
                        to right,
                        #fbbf24 20%,
                        #f59e0b 30%,
                        #ef4444 70%,
                        #fbbf24 80%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .preview-text.animate {
                    animation: fadeIn 0.6s forwards, shine 4s linear infinite;
                }

                @keyframes shine {
                    to { background-position: 200% center; }
                }

                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }

                .preview-bg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)),
                        url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop') center/cover;
                    opacity: 0.6;
                    filter: grayscale(100%);
                    transition: all 0.5s;
                }

                .controls {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .btn {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%);
                    color: #fff;
                    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
                }
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(124, 58, 237, 0.4);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .tips {
                    background: rgba(251, 191, 36, 0.1);
                    border: 1px solid rgba(251, 191, 36, 0.2);
                    padding: 20px;
                    border-radius: 16px;
                    margin-top: 25px;
                }

                .tips h4 {
                    color: #fbbf24;
                    margin-bottom: 10px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                }

                .feature-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 20px;
                    border-radius: 16px;
                    margin-bottom: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s;
                }
                .feature-box:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .feature-box h4 {
                    color: #a855f7;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 700;
                }
                .feature-box p {
                    color: #cbd5e1;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
            `}</style>
        </div>
    );
}
