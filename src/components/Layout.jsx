import React, { useState } from 'react';
import { Menu, X, CheckSquare, Calendar, Star, Settings, ChevronLeft, ChevronRight, Layout as LayoutIcon } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse

    const { tasks } = useTasks();
    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-30 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 
                    ${isSidebarCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`flex items-center h-16 px-4 border-b border-slate-800 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isSidebarCollapsed && (
                            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent truncate">
                                Organizador
                            </h1>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 hidden lg:block"
                            title={isSidebarCollapsed ? "Expandir" : "Colapsar"}
                        >
                            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <div className={`
                            flex items-center gap-3 p-3 text-indigo-400 bg-indigo-500/10 rounded-xl border border-indigo-500/20
                            ${isSidebarCollapsed ? 'justify-center' : ''}
                        `}>
                            <LayoutIcon size={24} />
                            {!isSidebarCollapsed && <span className="font-medium">Tablero</span>}
                        </div>
                    </nav>

                    {/* Footer / Stats - REMOVED as per request to move to header */}
                    {/* <div className="p-4 border-t border-slate-800">...</div> */}
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 bg-slate-50 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 lg:hidden sticky top-0 z-10 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-4 text-slate-500 hover:text-indigo-600"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">Organizador</h1>
                </header>

                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
