import React from "react";
import { motion } from "framer-motion";
import {
    History,
    Trophy,
    ShoppingBag,
    Activity,
    CreditCard,
    Target,
    ChevronRight,
    RefreshCw
} from "lucide-react";

import visperLogo from "@assets/visper_logo.png";

const VisperWindow: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col p-5 overflow-hidden select-none font-sans">
            {/* Header épuré */}
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src={visperLogo}
                            alt="Visper"
                            className="relative h-10 w-10 object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight leading-none uppercase">Visper</h1>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Intelligence Assistant</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-[10px] font-bold text-blue-400">VP: --</span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                            <span className="text-[10px] font-bold text-orange-400">RP: --</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">

                {/* Left Column: Live & Stats */}
                <div className="col-span-8 flex flex-col gap-4 overflow-hidden">

                    {/* Live Match / Lobby Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-linear-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={80} />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live Status</span>
                                </div>
                                <h2 className="text-xl font-bold">Initialisation...</h2>
                                <p className="text-sm text-gray-400 mt-1">Vérification de la session en cours.</p>
                            </div>
                            <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 group/refresh">
                                <RefreshCw size={16} className="text-gray-400 group-active/refresh:rotate-180 transition-transform duration-500" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Match History Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <History size={18} className="text-gray-400" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Historique</h3>
                            </div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Récent</span>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-xl transition-colors cursor-wait group">
                                    <div className="w-1.5 h-8 rounded-full bg-white/5 shadow-inner" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                                            <div className="h-2 w-10 bg-white/5 rounded animate-pulse" />
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
                                            <div className="h-3 w-8 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-800" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: MMR & Store */}
                <div className="col-span-4 flex flex-col gap-4 overflow-hidden">

                    {/* MMR / Rank Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center group"
                    >
                        <div className="flex items-center gap-2 mb-4 w-full">
                            <Trophy size={16} className="text-gray-500" />
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Progression</h3>
                        </div>
                        <div className="relative w-24 h-24 mb-3">
                            <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500/20" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Target size={32} className="text-gray-700 mb-1" />
                                <span className="text-xs font-black text-gray-600">--</span>
                            </div>
                        </div>
                        <h4 className="text-sm font-bold tracking-tight text-gray-500 italic">Récupération...</h4>
                        <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white/10 h-full w-[10%] transition-all duration-1000" />
                        </div>
                        <div className="flex justify-between w-full mt-2">
                            <span className="text-[9px] font-bold text-gray-600 uppercase">Ranked Rating</span>
                            <span className="text-[9px] font-bold text-gray-600">-- / 100 RR</span>
                        </div>
                    </motion.div>

                    {/* Storefront Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingBag size={18} className="text-gray-500" />
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Offres</h3>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group relative aspect-video bg-white/3 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden transition-all cursor-wait">
                                    <CreditCard size={20} className="text-white/5" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent">
                                        <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modern Footer */}
            <footer className="mt-5 flex justify-between items-center text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                <div className="flex gap-4">
                    <span className="text-white/20">SwitchMaster v2</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/20">Visper 1.0.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-500/20 animate-pulse" />
                    <span className="text-gray-700">Canal de données prêt</span>
                </div>
            </footer>
        </div>
    );
};

export default VisperWindow;
