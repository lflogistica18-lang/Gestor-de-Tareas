import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { usePeople } from '../context/PeopleContext'; // If needed for filters
import { Plus, Search, Calendar as CalendarIcon, Filter, Clock, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import TaskForm from './TaskForm';

export default function TaskBoard() {
    const { tasks, categories } = useTasks();
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Derived state
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed' && task.status !== 'completed') return false;
        if (filter === 'active' && task.status === 'completed') return false;
        if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleEdit = (task) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleNewTask = () => {
        setTaskToEdit(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Mis Tareas</h2>
                    <p className="text-slate-400 text-sm mt-1">Gestiona y organiza tus actividades pendientes</p>
                </div>

                <button
                    onClick={handleNewTask}
                    className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={18} className="mr-2" />
                    Nueva Tarea
                </button>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
                <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar tarea..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-7 flex flex-wrap gap-2">
                    {['all', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filter === f
                                ? 'bg-slate-800 text-white border-slate-700'
                                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
                                }`}
                        >
                            {f === 'all' ? 'Todas' : f === 'active' ? 'Pendientes' : 'Completadas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                            <Filter size={24} className="opacity-50" />
                        </div>
                        <p className="text-lg">No se encontraron tareas</p>
                        <p className="text-sm opacity-60">Prueba ajustando los filtros o crea una nueva</p>
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {isFormOpen && (
                <TaskForm
                    onClose={() => setIsFormOpen(false)}
                    taskToEdit={taskToEdit}
                />
            )}
        </div>
    );
}

function TaskCard({ task, onEdit }) {
    const isUrgent = task.dueDate && (isPast(parseISO(task.dueDate)) || isToday(parseISO(task.dueDate))) && task.status !== 'completed';

    return (
        <article className={`
      group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20
      flex flex-col relative overflow-hidden
      ${isUrgent ? 'ring-1 ring-red-500/20' : ''}
    `}>
            {/* Category Badge */}
            <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                    {task.category}
                </span>
                {isUrgent && (
                    <span className="flex items-center text-red-400 text-xs font-bold animate-pulse">
                        <AlertCircle size={14} className="mr-1" />
                        {isPast(parseISO(task.dueDate)) ? 'Vencida' : 'Vence hoy'}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {task.title}
            </h3>

            {task.description && (
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                    {task.description}
                </p>
            )}

            <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1.5 opacity-70" />
                    <span>{task.dueDate ? format(parseISO(task.dueDate), 'd MMM', { locale: es }) : 'Sin fecha'}</span>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                        Editar
                    </button>
                </div>
            </div>
        </article>
    );
}
