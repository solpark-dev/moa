import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Minus, Square, Computer, Disc, FolderOpen, Globe, ArrowRight } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

/**
 * Variant W95 - "Retro Desktop OS"
 * Design Direction:
 * - Windows 95/98 Aesthetic (Bevel borders, #C0C0C0 gray)
 * - Draggable Windows
 * - Desktop Icons
 * - Taskbar with Start Menu & Clock
 */

// --- Retro UI Components ---

const BevelBox = ({ children, className = "", type = "out", ...props }) => {
    const shadows = type === "out"
        ? "border-t-white border-l-white border-b-black border-r-black shadow-[1px_1px_0px_0px_#808080,inset_1px_1px_0px_0px_#DFDFDF]"
        : "border-t-black border-l-black border-b-white border-r-white shadow-[inset_1px_1px_0px_0px_#808080]";

    return (
        <div className={`border-2 ${shadows} bg-[#C0C0C0] ${className}`} {...props}>
            {children}
        </div>
    );
};

const DesktopIcon = ({ label, icon: Icon, onDoubleClick, color = "text-blue-800" }) => (
    <div
        className="flex flex-col items-center gap-1 w-24 p-2 cursor-pointer group mb-4"
        onDoubleClick={onDoubleClick}
    >
        <div className={`w-10 h-10 ${color} mb-1 group-hover:opacity-80`}>
            <Icon className="w-full h-full" strokeWidth={1.5} />
        </div>
        <span className="text-white text-xs text-center px-1 bg-[#008080] group-hover:bg-blue-800 font-mono dotted-border">
            {label}
        </span>
    </div>
);

const Window = ({ id, title, icon: Icon, children, isOpen, onClose, zIndex, onFocus, initialPos = { x: 0, y: 0 } }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={initialPos}
            onMouseDown={() => onFocus(id)}
            style={{ zIndex }}
            className="absolute top-0 left-0 w-full max-w-lg md:max-w-2xl"
        >
            <BevelBox type="out" className="flex flex-col shadow-xl">
                {/* Title Bar */}
                <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between select-none handle cursor-default">
                    <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                        {Icon && <Icon size={14} />}
                        <span>{title}</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="w-4 h-4 bg-[#C0C0C0] border border-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                            <Minus size={10} className="text-black" />
                        </button>
                        <button className="w-4 h-4 bg-[#C0C0C0] border border-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                            <Square size={10} className="text-black" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(id); }}
                            className="w-4 h-4 bg-[#C0C0C0] border border-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white ml-1"
                        >
                            <X size={12} className="text-black" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-1 cursor-default bg-[#C0C0C0]">
                    {children}
                </div>
            </BevelBox>
        </motion.div>
    );
};

export default function LandingPageRetro() {
    const [windows, setWindows] = useState({
        welcome: { isOpen: true, z: 10, title: "Welcome_to_MoA.txt", icon: Computer, x: 50, y: 50 },
        browser: { isOpen: true, z: 9, title: "MoA Explorer - Party List", icon: Globe, x: 100, y: 150 },
        calc: { isOpen: false, z: 8, title: "Savings Calculator.exe", icon: Disc, x: 200, y: 100 },
    });
    const [activeId, setActiveId] = useState("welcome");
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const bringToFront = (id) => {
        setActiveId(id);
        setWindows(prev => {
            const maxZ = Math.max(...Object.values(prev).map(w => w.z));
            return { ...prev, [id]: { ...prev[id], z: maxZ + 1 } };
        });
    };

    const toggleWindow = (id) => {
        setWindows(prev => {
            const isOpen = !prev[id].isOpen;
            if (isOpen) bringToFront(id);
            return { ...prev, [id]: { ...prev[id], isOpen } };
        });
    };

    return (
        <div className="fixed inset-0 bg-[#008080] font-mono overflow-hidden select-none">

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 z-0">
                <DesktopIcon label="Welcome" icon={Computer} onDoubleClick={() => toggleWindow('welcome')} color="text-gray-200" />
                <DesktopIcon label="MoA Explorer" icon={Globe} onDoubleClick={() => toggleWindow('browser')} color="text-blue-300" />
                <DesktopIcon label="My Savings" icon={Disc} onDoubleClick={() => toggleWindow('calc')} color="text-yellow-300" />
                <DesktopIcon label="Party Folder" icon={FolderOpen} onDoubleClick={() => toggleWindow('browser')} color="text-yellow-500" />

                <Link to="/party">
                    <DesktopIcon label="Start App >>" icon={ArrowRight} color="text-green-400" />
                </Link>
            </div>

            {/* 1. Welcome Window */}
            <Window
                id="welcome"
                {...windows.welcome}
                onClose={() => toggleWindow('welcome')}
                onFocus={bringToFront}
                zIndex={windows.welcome.z}
                initialPos={{ x: windows.welcome.x, y: windows.welcome.y }}
            >
                <div className="bg-white p-6 h-64 overflow-y-auto font-sans text-sm border-2 border-t-black border-l-black border-r-white border-b-white">
                    <h1 className="text-2xl font-bold mb-4 font-serif">Welcome to MoA OS</h1>
                    <p className="mb-4">
                        MoA is the safest way to share your OTT subscriptions.<br />
                        Experience premium content at a fraction of the price.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Save up to 75% on monthly bills</li>
                        <li>Instant Party Matching</li>
                        <li>Secure Escrow Payment</li>
                    </ul>
                    <div className="text-center">
                        <button
                            onClick={() => toggleWindow('browser')}
                            className="px-4 py-1 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                        >
                            Enter MoA Explorer
                        </button>
                    </div>
                </div>
            </Window>

            {/* 2. Calculator Window */}
            <Window
                id="calc"
                {...windows.calc}
                onClose={() => toggleWindow('calc')}
                onFocus={bringToFront}
                zIndex={windows.calc.z}
                initialPos={{ x: windows.calc.x, y: windows.calc.y }}
            >
                <div className="bg-[#C0C0C0] p-4 w-64">
                    <BevelBox type="in" className="bg-white h-10 mb-4 flex items-center justify-end px-2 text-xl font-mono">
                        32,500
                    </BevelBox>
                    <div className="grid grid-cols-4 gap-2 text-center text-sm font-bold">
                        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(btn => (
                            <button key={btn} className="h-8 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center">
                                {btn}
                            </button>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-center">Monthly Savings Estimate</p>
                </div>
            </Window>

            {/* 3. Browser Window (Main Content) */}
            <Window
                id="browser"
                {...windows.browser}
                onClose={() => toggleWindow('browser')}
                onFocus={bringToFront}
                zIndex={windows.browser.z}
                initialPos={{ x: windows.browser.x, y: windows.browser.y }}
            >
                <div className="flex flex-col h-[400px]">
                    {/* Address Bar */}
                    <div className="flex items-center gap-2 mb-2 p-1">
                        <span className="text-xs">Address:</span>
                        <BevelBox type="in" className="flex-1 bg-white px-2 py-0.5 text-sm flex items-center">
                            http://www.moa-party.com/trending
                        </BevelBox>
                        <button className="px-2 text-xs border-2 border-t-white border-l-white border-r-black border-b-black">Go</button>
                    </div>

                    {/* Web View */}
                    <BevelBox type="in" className="flex-1 bg-white overflow-y-auto p-4">
                        <h2 className="text-xl font-bold mb-4 text-blue-800 underline">Top Parties</h2>
                        <div className="space-y-4">
                            {/* MOCK_PARTIES 안전하게 매핑 */}
                            {MOCK_PARTIES && MOCK_PARTIES.length > 0 ? (
                                MOCK_PARTIES.slice(0, 3).map((party, i) => (
                                    <div key={i} className="flex items-center gap-3 border border-gray-300 p-2 hover:bg-blue-50 cursor-pointer">
                                        <div className={`w-12 h-12 flex items-center justify-center text-white font-bold
                                  ${party.platform === 'Netflix' ? 'bg-red-600' : 'bg-blue-600'}
                               `}>
                                            {/* 안전한 접근: party.platform이 존재할 때만 첫 글자 표시 */}
                                            {party.platform ? party.platform[0] : '?'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{party.title || 'Unknown Party'}</div>
                                            <div className="text-xs text-gray-500">{party.members} Members • {party.price}</div>
                                        </div>
                                        <button className="px-3 py-1 bg-[#C0C0C0] text-xs border border-black shadow-sm">Join</button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-4 text-gray-500">No parties available.</div>
                            )}

                            <div className="text-center mt-4">
                                <Link to="/party" className="text-blue-600 underline text-sm">View All Parties...</Link>
                            </div>
                        </div>
                    </BevelBox>
                </div>
            </Window>


            {/* Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#C0C0C0] border-t-2 border-white flex items-center justify-between px-1 z-50">
                <button
                    className="flex items-center gap-1 px-2 py-1 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white font-bold text-sm"
                >
                    <div className="w-4 h-4 bg-black/80 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold italic">W</span>
                    </div>
                    Start
                </button>

                <div className="flex-1 px-2 flex gap-1">
                    {Object.entries(windows).map(([key, win]) => (
                        win.isOpen && (
                            <button
                                key={key}
                                onClick={() => bringToFront(key)}
                                className={`
                            px-4 py-1 text-xs truncate max-w-[150px] border-2
                            ${activeId === key
                                        ? "bg-[#E0E0E0] border-t-black border-l-black border-r-white border-b-white font-bold"
                                        : "bg-[#C0C0C0] border-t-white border-l-white border-r-black border-b-black"}
                        `}
                            >
                                {win.title}
                            </button>
                        )
                    ))}
                </div>

                <BevelBox type="in" className="px-3 py-1 bg-[#C0C0C0] text-xs">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </BevelBox>
            </div>
        </div>
    );
}