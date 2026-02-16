import React from 'react';
import { Calendar, User, AlertCircle, ArrowRight, CheckCircle2, Clock, Check, Trash2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTasks } from '../context/TaskContext';

export default function TaskCard({ task, onEdit, isTomorrowView = false }) {
    const { moveTaskToTomorrow, moveTaskToToday, updateTask, deleteTask } = useTasks();

    const priorityHeaderColors = {
        high: 'bg-red-500 border-red-600 text-white',
        medium: 'bg-amber-500 border-amber-600 text-white',
        low: 'bg-blue-500 border-blue-600 text-white',
        default: 'bg-slate-700 border-slate-800 text-white'
    };

    const handleComplete = (e) => {
        e.stopPropagation();
        if (task.status === 'completed') {
            updateTask(task.id, { status: 'pending' });
        } else {
            updateTask(task.id, { status: 'completed' });
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
            deleteTask(task.id);
        }
    };

    const isCompleted = task.status === 'completed';
    // Greenish style for completed tasks as requested
    const headerStyle = isCompleted
        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
        : (priorityHeaderColors[task.priority] || priorityHeaderColors.default);

    return (
        <div
            onClick={onEdit}
            className={`
                group relative flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer hover:shadow-lg
                ${isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                }
            `}
        >
            {/* Header with Priority Color */}
            <div className={`px-3 py-2 flex items-center justify-between gap-2 ${headerStyle}`}>
                <h4 className={`text-sm font-bold truncate flex-1 leading-tight ${isCompleted ? 'line-through' : ''}`}>
                    {task.title}
                </h4>

                <div className="flex items-center gap-1">
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar tarea"
                    >
                        <Trash2 size={14} />
                    </button>

                    {/* Complete Button */}
                    <button
                        onClick={handleComplete}
                        className={`
                            shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600'
                                : 'border-white/50 hover:bg-white hover:text-indigo-600 text-transparent'
                            }
                        `}
                        title={isCompleted ? "Marcar como pendiente" : "Marcar como realizada"}
                    >
                        <Check size={12} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 flex-1 flex flex-col gap-2">
                {task.description && (
                    <p className={`text-xs text-slate-500 line-clamp-2 ${isCompleted ? 'opacity-50' : ''}`}>
                        {task.description}
                    </p>
                )}

                {/* Assignees Display */}
                {task.assignees && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-fit">
                        <User size={10} className="text-indigo-400" />
                        <span className="truncate max-w-[150px]">{task.assignees}</span>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    {/* Date */}
                    {(task.dueDate && !isCompleted) ? (
                        <div className={`flex items-center gap-1 font-medium ${task.dueDate < format(new Date(), 'yyyy-MM-dd') ? 'text-red-500' :
                                task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'text-green-600' : 'text-slate-400'
                            }`}>
                            <Clock size={12} />
                            {task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'Hoy' :
                                task.dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'Mañana' :
                                    format(new Date(parseInt(task.dueDate.split('-')[0]), parseInt(task.dueDate.split('-')[1]) - 1, parseInt(task.dueDate.split('-')[2])), "d MMM", { locale: es })}
                        </div>
                    ) : (
                        <span></span>
                    )}

                    {/* Quick Actions (Hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {!isCompleted && task.dueDate === format(new Date(), 'yyyy-MM-dd') && (
                            <button
                                onClick={(e) => { e.stopPropagation(); moveTaskToTomorrow(task.id); }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 flex items-center gap-1"
                                title="Pasar a mañana"
                            >
                                Mañana <ArrowRight size={10} />
                            </button>
                        )}
                        {/* Helper for tomorrow view */}
                        {isTomorrowView && (
                            <button
                                onClick={(e) => { e.stopPropagation(); moveTaskToToday(task.id); }}
                                className="p-1 hover:bg-indigo-50 text-indigo-500 rounded flex items-center gap-1"
                                title="Traer a hoy"
                            >
                                <ArrowRight size={10} className="rotate-180" /> Hoy
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
