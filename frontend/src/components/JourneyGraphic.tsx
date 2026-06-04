import React from 'react';
import { motion } from 'framer-motion';

export default function JourneyGraphic() {
    return (
        <div className="relative w-full max-w-4xl mx-auto py-16 px-4 bg-gray-900 overflow-hidden rounded-2xl shadow-2xl flex flex-col items-center justify-center font-sans">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-16 tracking-tight">
                THE JOURNEY OF EVERY<br />
                <span className="text-cyan-400">PROFITABLE TRADER</span>
            </h1>

            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
                {/* Layer 1 - Compound Zone (Outermost) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-full bg-[#70C1E8]/30 border border-[#70C1E8]/50 flex flex-col justify-between py-12"
                >
                    <div className="text-white text-xs md:text-sm font-medium pt-8 px-12 md:px-24 flex justify-between w-full h-full text-center">
                        <div className="w-1/3 -ml-4 mt-8">You align your<br />trading with your<br />purpose.</div>
                        <div className="w-1/3 -mr-6 mt-16">Profits are the<br />byproduct of<br />consistency, not the<br />goal.</div>
                    </div>
                </motion.div>

                {/* Layer 2 - Consistent Zone */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute inset-[10%] rounded-full bg-[#189FB9] shadow-lg flex items-center justify-center"
                >
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-6 md:px-12">
                        <div className="text-white/90 text-xs text-center w-1/4 -mt-16 ml-2">Trusting the<br />system over the<br />feeling.</div>
                        <div className="text-white/90 text-xs text-center w-1/4 -mt-16 mr-2">Stops hold.<br />Rules hold.</div>
                    </div>
                </motion.div>

                {/* Layer 3 - Process Zone */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute inset-[25%] rounded-full bg-[#F38A1D] shadow-lg flex items-center justify-center"
                >
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                        <div className="text-white/95 text-xs text-center w-1/3 mt-16 -ml-4">Following rules<br />even when<br />uncomfortable.</div>
                        <div className="text-white/95 text-xs text-center w-1/3 mt-16 -mr-4">Journaling every<br />trade. Win or lose.</div>
                    </div>
                </motion.div>

                {/* Layer 4 - Reactive Zone */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute inset-[40%] rounded-full bg-[#FFBC1C] shadow-lg flex items-center justify-center"
                >
                    <div className="absolute bottom-[10%] w-full flex justify-between px-2">
                        <div className="text-[#333] text-[10px] md:text-xs text-center w-1/2 font-semibold">Moving stops.<br />Sizing up after<br />winners.</div>
                        <div className="text-[#333] text-[10px] md:text-xs text-center w-1/2 font-semibold">FOMO in.<br />Revenge trade.<br />Repeat.</div>
                    </div>
                </motion.div>

                {/* Layer 5 - Waiting Zone (Innermost) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute inset-[55%] rounded-full bg-[#E5E2FA] shadow-lg flex flex-col items-center justify-end pb-4 object-cover"
                >
                    <div className="text-[#1A2542] text-[10px] md:text-xs font-semibold text-center mt-auto px-2 pb-2">
                        Strategy-hopping.<br />Waiting to feel ready.<br />Nothing changes.
                    </div>
                </motion.div>

                {/* Center Vertical Arrow Line */}
                <div className="absolute top-[-10px] bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#11244C] z-50"></div>
                {/* Arrowhead */}
                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#11244C] z-50"></div>

                {/* Labels Z-Indexed above shapes */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between z-50 h-[80%] my-auto top-[5%]">

                    <div className="bg-[#11244C] text-white px-6 py-2 pb-[10px] font-bold tracking-wider text-sm md:text-base border-b-2 border-b-cyan-500 rounded shadow-md mt-4">
                        COMPOUND ZONE
                    </div>

                    <div className="bg-[#11244C] text-white px-6 py-2 pb-[10px] font-bold tracking-wider text-sm md:text-base border-b-2 border-b-cyan-500 rounded shadow-md mt-4">
                        CONSISTENT ZONE
                    </div>

                    <div className="bg-[#11244C] text-white px-6 py-2 pb-[10px] font-bold tracking-wider text-sm md:text-base border-b-2 border-b-cyan-500 rounded shadow-md mt-4">
                        PROCESS ZONE
                    </div>

                    <div className="bg-[#11244C] text-white px-6 py-2 pb-[10px] font-bold tracking-wider text-sm md:text-base border-b-2 border-b-cyan-500 rounded shadow-md mt-4 flex flex-col items-center">
                        REACTIVE ZONE
                        <span className="text-[#FFBC1C] text-[10px] font-normal leading-tight mt-1 bg-[#11244C] absolute -bottom-5 w-max">
                            Trading on feel, not rules.
                        </span>
                    </div>

                    <div className="bg-[#11244C] text-white px-6 py-2 pb-[10px] font-bold tracking-wider text-sm md:text-base border-b-2 border-b-cyan-500 rounded shadow-md mt-10">
                        WAITING ZONE
                    </div>

                </div>
            </div>

            {/* Right Bottom Logo */}
            <div className="absolute bottom-6 right-8 flex items-center justify-center z-50 pointer-events-none">
                <span className="text-3xl md:text-4xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">MEDYSA</span>
            </div>
        </div>
    );
}
