import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Plus, Search, Calendar as CalendarIcon, Filter, ChevronUp, ChevronDown, Briefcase, User, Layout, Trash2, ListChecks, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addDays, subDays, isToday, isTomorrow, isYesterday, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

export default function TaskBoard() {
    const { tasks, subsections, deleteSection, addSection, addTask } = useTasks();
    const [activeDivision, setActiveDivision] = useState('personal'); // 'personal' | 'work'
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Dropdown state
    const [currentMonth, setCurrentMonth] = useState(new Date()); // For calendar navigation
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [initialSectionForForm, setInitialSectionForForm] = useState(null);

    // Estado para Quick Add
    const [activeQuickAddSection, setActiveQuickAddSection] = useState(null);
    const [quickAddTitle, setQuickAddTitle] = useState('');

    // Helpers
    // FIX: Parse YYYY-MM-DD string as LOCAL date to avoid UTC shifts
    const parseLocalDate = (dateString) => {
        if (!dateString) return new Date();
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handlePrevDay = () => setSelectedDate(prev => format(subDays(parseLocalDate(prev), 1), 'yyyy-MM-dd'));
    const handleNextDay = () => setSelectedDate(prev => format(addDays(parseLocalDate(prev), 1), 'yyyy-MM-dd'));
    const handleToday = () => {
        const today = new Date();
        setSelectedDate(format(today, 'yyyy-MM-dd'));
        setCurrentMonth(today);
    };

    // Calendar Generation Logic
    const generateCalendarDays = () => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }); // Monday start
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    };

    const handleDateSelect = (date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
        setIsCalendarOpen(false);
    };

    // Pending Count for Header
    const currentTasks = tasks.filter(task => {
        const isDateMatch = task.dueDate === selectedDate;
        const isDivisionMatch = (task.division || 'personal') === activeDivision;
        const isSearchMatch = search ? task.title.toLowerCase().includes(search.toLowerCase()) : true;
        return isDateMatch && isDivisionMatch && isSearchMatch;
    });

    // Subsections for columns
    const currentSubsections = subsections[activeDivision] || [];

    const pendingCount = currentTasks.filter(t => t.status !== 'completed').length;

    const handleEdit = (task) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleNewTask = (section = null) => {
        setTaskToEdit(null);
        setInitialSectionForForm(section);
        setIsFormOpen(true);
    };

    const handleQuickAdd = (section) => {
        if (!quickAddTitle.trim()) return;

        const newTask = {
            title: quickAddTitle.trim(),
            description: '',
            division: activeDivision,
            section: section,
            dueDate: selectedDate,
            priority: 'medium',
            status: 'pending',
            assignees: ''
        };

        addTask(newTask);
        setQuickAddTitle('');
        // No cerramos el activeQuickAddSection para permitir agregar múltiples seguidas
        // setActiveQuickAddSection(null); 
    };

    const toggleQuickAdd = (section) => {
        if (activeQuickAddSection === section) {
            setActiveQuickAddSection(null);
            setQuickAddTitle('');
        } else {
            setActiveQuickAddSection(section);
            setQuickAddTitle('');
        }
    };

    // Date Display Label
    const getDateLabel = () => {
        const date = parseLocalDate(selectedDate);
        if (isToday(date)) return 'Hoy';
        if (isTomorrow(date)) return 'Mañana';
        if (isYesterday(date)) return 'Ayer';
        return format(date, "d 'de' MMMM", { locale: es });
    };

    return (
        <div className="h-full flex flex-col p-4 lg:p-6 overflow-hidden bg-slate-50 text-slate-900">
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 shrink-0">

                {/* Title & Stats */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                            {activeDivision === 'personal' ? <User size={28} className="text-indigo-600" /> : <Briefcase size={28} className="text-indigo-600" />}
                            {activeDivision === 'personal' ? 'Personal' : 'Trabajo'}
                        </h1>
                        <div className="h-6 w-px bg-slate-300 mx-2"></div>
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 text-sm">
                            {pendingCount} Pendientes
                        </span>
                    </div>
                </div>

                {/* Center Navigation (Date) - Responsive placement */}
                <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-1 self-center xl:absolute xl:left-1/2 xl:-translate-x-1/2 relative z-20">
                    <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="flex items-center gap-2 px-4 min-w-[140px] justify-center font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors py-1"
                    >
                        <CalendarIcon size={16} className="text-indigo-500" />
                        <span className="capitalize">{getDateLabel()}</span>
                    </button>

                    <button onClick={handleNextDay} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                    {/* Button 'Ir a Hoy' if selectedDate is NOT today */}
                    {selectedDate !== format(new Date(), 'yyyy-MM-dd') && (
                        <button onClick={handleToday} className="ml-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">
                            ir a Hoy
                        </button>
                    )}

                    {/* DROPDOWN CALENDAR */}
                    {isCalendarOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)} /> {/* Backdrop */}
                            <div className="absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-72 z-20 animate-in fade-in zoom-in-95 duration-100">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="font-bold text-slate-700 capitalize">
                                        {format(currentMonth, 'MMMM yyyy', { locale: es })}
                                    </span>
                                    <button
                                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                                        <div key={d} className="font-bold text-slate-400">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {generateCalendarDays().map((day, idx) => {
                                        // Compare strings to avoid timezone issues
                                        const dayString = format(day, 'yyyy-MM-dd');
                                        const isSelected = dayString === selectedDate;
                                        const isCurrentMonth = isSameMonth(day, currentMonth);
                                        const isTodayDate = isToday(day);

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleDateSelect(day)}
                                                className={`
                                                    h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all relative
                                                    ${isSelected
                                                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30'
                                                        : isCurrentMonth ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300'
                                                    }
                                                    ${isTodayDate && !isSelected ? 'ring-1 ring-indigo-500 font-bold text-indigo-600' : ''}
                                                `}
                                            >
                                                {format(day, 'd')}
                                                {/* Dot for tasks indicator could go here if we had that data readily available for all days */}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                            <ListChecks size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar tarea..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Division Switcher */}
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveDivision('personal')}
                            className={`p-2 rounded-md transition-all ${activeDivision === 'personal' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            title="Personal"
                        >
                            <User size={18} />
                        </button>
                        <button
                            onClick={() => setActiveDivision('work')}
                            className={`p-2 rounded-md transition-all ${activeDivision === 'work' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            title="Trabajo"
                        >
                            <Briefcase size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => handleNewTask()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                        title="Nueva Tarea"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* RESPONSIVE GRID COLUMNS */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
                    {currentSubsections.map(section => {
                        const sectionTasks = currentTasks.filter(t => (t.section || 'General') === section);
                        const pending = sectionTasks.filter(t => t.status !== 'completed');
                        const completed = sectionTasks.filter(t => t.status === 'completed');

                        return (
                            <div key={section} className="flex flex-col bg-slate-100 rounded-xl border border-slate-200 shadow-sm h-[500px] max-h-[60vh] overflow-hidden">
                                {/* Column Header */}
                                <div className="p-3 bg-indigo-900 text-white flex justify-between items-center sticky top-0 z-10 shadow-md">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <h3 className="font-semibold truncate text-sm uppercase tracking-wide" title={section}>{section}</h3>
                                        <span className="bg-indigo-800 text-indigo-200 text-[10px] px-1.5 py-0.5 rounded-full border border-indigo-700 font-medium">
                                            {pending.length}
                                        </span>
                                    </div>

                                    {section !== 'General' && (
                                        <button
                                            onClick={() => deleteSection(activeDivision, section)}
                                            className="text-indigo-300 hover:text-red-400 transition-colors p-1 rounded"
                                            title="Eliminar sección"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50">
                                    {pending.length > 0 ? (
                                        <div className="space-y-3">
                                            {pending.map(task => (
                                                <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} />
                                            ))}
                                        </div>
                                    ) : (
                                        // Mostrar estado vacío SOLO si no hay tareas completadas y NO estamos en modo quick add
                                        (completed.length === 0 && activeQuickAddSection !== section) && (
                                            <div
                                                onClick={() => toggleQuickAdd(section)}
                                                className="py-8 text-center border-2 border-dashed border-slate-200 rounded-lg opacity-50 bg-white/50 mx-2 mt-4 flex flex-col items-center justify-center gap-2 group hover:opacity-100 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all cursor-pointer"
                                            >
                                                <p className="text-xs text-slate-400">Sin tareas para {getDateLabel()}</p>
                                                <div className="flex items-center gap-1 text-indigo-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                    <Plus size={14} /> <span>Agregar aquí</span>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {/* QUICK ADD SECTION */}
                                    {activeQuickAddSection === section ? (
                                        <div className="mt-3 bg-white p-3 rounded-xl border-2 border-indigo-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Escribe la tarea..."
                                                value={quickAddTitle}
                                                onChange={(e) => setQuickAddTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleQuickAdd(section);
                                                    if (e.key === 'Escape') toggleQuickAdd(null);
                                                }}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 mb-2"
                                            />
                                            <div className="flex justify-between items-center">
                                                <button
                                                    onClick={() => toggleQuickAdd(null)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Cancelar (Esc)"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleNewTask(section)}
                                                        className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium"
                                                        title="Abrir formulario completo"
                                                    >
                                                        Detalles
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickAdd(section)}
                                                        disabled={!quickAddTitle.trim()}
                                                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm shadow-indigo-500/20"
                                                    >
                                                        <Plus size={14} /> Agregar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Botón siempre visible al final de la lista de pendientes (o después del empty state)
                                        <button
                                            onClick={() => toggleQuickAdd(section)}
                                            className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg border border-transparent hover:border-indigo-100 border-dashed transition-all group text-sm font-medium"
                                        >
                                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                            <span>Agregar Tarea</span>
                                        </button>
                                    )}

                                    {completed.length > 0 && (
                                        <div className="pt-3 mt-2 border-t border-slate-200/50">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 opacity-70 px-1">
                                                Realizadas
                                            </h4>
                                            <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                                                {completed.map(task => (
                                                    <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Section Button */}
                    <button
                        onClick={() => {
                            const name = prompt("Nombre de la nueva sección:");
                            if (name) addSection(activeDivision, name);
                        }}
                        className="flex flex-col items-center justify-center h-32 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/10 text-slate-400 hover:text-indigo-500 transition-all opacity-70 hover:opacity-100"
                    >
                        <Plus size={24} className="mb-2" />
                        <span className="text-sm font-medium">Nueva Sección</span>
                    </button>
                </div>
            </div>

            {/* Task Form Modal */}
            {isFormOpen && (
                <TaskForm
                    onClose={() => setIsFormOpen(false)}
                    taskToEdit={taskToEdit}
                    initialSection={initialSectionForForm}
                    initialDivision={activeDivision}
                    initialDate={selectedDate} // Pass selected date to form
                />
            )}
        </div>
    );
}
