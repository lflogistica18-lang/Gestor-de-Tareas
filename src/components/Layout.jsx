import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children, currentView, onNavigate }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleNavClick = (view) => {
        onNavigate(view);
        setIsSidebarOpen(false); // Close sidebar on mobile on nav
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:translate-x-0 inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-center h-16 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        TaskOrganizer
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Tablero"
                        active={currentView === 'dashboard'}
                        onClick={() => handleNavClick('dashboard')}
                    />
                    <NavItem
                        icon={<BarChart3 size={20} />}
                        label="Reportes"
                        active={currentView === 'reports'}
                        onClick={() => handleNavClick('reports')}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Personas"
                        active={currentView === 'people'}
                        onClick={() => handleNavClick('people')}
                    />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem icon={<Settings size={20} />} label="Configuración" />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center px-6 lg:hidden sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-semibold text-lg">
                        {currentView === 'dashboard' ? 'Tablero' : currentView === 'reports' ? 'Reportes' : 'Personas'}
                    </span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
      w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
      ${active
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border hover:border-slate-700/50 border border-transparent'}
    `}>
            <span className={`${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {icon}
            </span>
            <span className="ml-3">{label}</span>
        </button>
    );
}
