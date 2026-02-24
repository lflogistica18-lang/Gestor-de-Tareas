import React, { useState } from 'react';
import { Calendar, User, AlertCircle, ArrowRight, CheckCircle2, Clock, Check, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTasks } from '../context/TaskContext';

export default function TaskCard({ task, onEdit, isTomorrowView = false }) {
    const { moveTaskToTomorrow, moveTaskToToday, updateTask, deleteTask } = useTasks();
    const [isExpanded, setIsExpanded] = useState(false);

    const priorityHeaderColors = {
        high: 'bg-red-500 border-red-600 text-white',
        medium: 'bg-amber-500 border-amber-600 text-white',
        low: 'bg-blue-500 border-blue-600 text-white',
        default: 'bg-slate-700 border-slate-800 text-white'
    };

    const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };

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

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit();
    };

    const isCompleted = task.status === 'completed';
    const isInProgress = task.status === 'in_progress';

    const headerStyle = isCompleted
        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
        : (priorityHeaderColors[task.priority] || priorityHeaderColors.default);

    const handleStartTask = (e) => {
        e.stopPropagation();
        updateTask(task.id, { status: 'in_progress' });
    };

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            draggable={!isCompleted}
            onDragStart={(e) => {
                if (!isCompleted) {
                    e.dataTransfer.setData('taskId', task.id);
                    e.dataTransfer.effectAllowed = 'move';
                }
            }}
            className={`
                group relative flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer hover:shadow-lg
                ${isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : isInProgress
                        ? 'bg-white border-[#CCFF00] border-2 shadow-[0_0_15px_rgba(204,255,0,0.4)] animate-pulse-subtle'
                        : 'bg-white border-slate-200 hover:border-[#D4782F] shadow-sm'
                }
            `}
        >
            {/* Header with Priority Color */}
            <div className={`px-3 py-2 flex items-start gap-2 ${headerStyle}`}>
                <h4 className={`text-sm font-bold flex-1 min-w-0 leading-tight ${isCompleted ? 'line-through' : ''}`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {task.title}
                </h4>

                <div className="flex items-center gap-1 shrink-0">
                    {/* Pencil Edit Button */}
                    {!isCompleted && (
                        <button
                            onClick={handleEditClick}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                            title="Editar tarea"
                        >
                            <Pencil size={14} />
                        </button>
                    )}

                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar tarea"
                    >
                        <Trash2 size={14} />
                    </button>

                    {/* Complete Button */}
                    <button
                        onClick={handleComplete}
                        className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                            ${isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600'
                                : 'border-white/50 hover:bg-white hover:text-[#893101] text-transparent'
                            }
                        `}
                        title={isCompleted ? "Marcar como pendiente" : "Marcar como realizada"}
                    >
                        <Check size={12} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Collapsed Body - minimal info */}
            {!isExpanded && (
                <div className="px-3 py-2 flex items-center justify-between text-[10px] text-slate-400">
                    {(task.dueDate && !isCompleted) ? (
                        <div className={`flex items-center gap-1 font-medium ${task.dueDate < format(new Date(), 'yyyy-MM-dd') ? 'text-red-500' :
                            task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'text-green-600' : 'text-slate-400'
                            }`}>
                            <Clock size={12} />
                            {task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'Hoy' :
                                task.dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'Mañana' :
                                    format(new Date(parseInt(task.dueDate.split('-')[0]), parseInt(task.dueDate.split('-')[1]) - 1, parseInt(task.dueDate.split('-')[2])), "d MMM", { locale: es })}
                        </div>
                    ) : <span></span>}
                    <ChevronDown size={14} className="text-slate-300" />
                </div>
            )}

            {/* Expanded Body - full details */}
            {isExpanded && (
                <div className="p-3 flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-200">
                    {/* Task Name (repeated large) */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tarea</span>
                        <p className={`text-sm font-semibold text-slate-800 mt-0.5 ${isCompleted ? 'line-through opacity-50' : ''}`} style={{ wordBreak: 'break-word' }}>
                            {task.title}
                        </p>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalle</span>
                            <p className={`text-xs text-slate-600 mt-0.5 whitespace-pre-wrap ${isCompleted ? 'opacity-50' : ''}`} style={{ wordBreak: 'break-word' }}>
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Priority */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prioridad:</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {priorityLabels[task.priority] || 'Normal'}
                        </span>
                    </div>

                    {/* Assignees Display */}
                    {task.assignees && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white px-2 py-1 rounded-md w-fit border border-slate-100">
                            <User size={10} className="text-[#B8510A]" />
                            <span>{task.assignees}</span>
                        </div>
                    )}

                    {/* Date */}
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${task.dueDate < format(new Date(), 'yyyy-MM-dd') ? 'text-red-500' :
                            task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'text-green-600' : 'text-slate-500'
                            }`}>
                            <Clock size={12} />
                            {task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'Hoy' :
                                task.dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'Mañana' :
                                    format(new Date(parseInt(task.dueDate.split('-')[0]), parseInt(task.dueDate.split('-')[1]) - 1, parseInt(task.dueDate.split('-')[2])), "d 'de' MMMM", { locale: es })}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                        {isCompleted ? (
                            <button
                                onClick={handleComplete}
                                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm transition-all"
                            >
                                <ArrowRight size={16} className="rotate-180" />
                                Volver a Pendiente
                            </button>
                        ) : (
                            <>
                                {isInProgress ? (
                                    <button
                                        onClick={handleComplete}
                                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm"
                                    >
                                        <CheckCircle2 size={16} />
                                        Terminar Tarea
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStartTask}
                                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-[#893101] hover:bg-[#A03B05] text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm"
                                    >
                                        <Clock size={16} />
                                        Iniciar Tarea
                                    </button>
                                )}
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center justify-center p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg border border-emerald-200 transition-all"
                                    title="Completar directamente"
                                >
                                    <Check size={18} />
                                </button>
                            </>
                        )}

                        <div className="flex gap-2 w-full mt-1">
                            {!isCompleted && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); moveTaskToTomorrow(task.id); }}
                                    className="flex-1 py-1.5 px-3 hover:bg-slate-100 rounded-lg text-slate-500 text-[11px] font-bold transition-all border border-slate-200"
                                >
                                    Mañana
                                </button>
                            )}
                            <button
                                onClick={handleEditClick}
                                className="flex-1 py-1.5 px-3 hover:bg-slate-100 rounded-lg text-slate-500 text-[11px] font-bold transition-all border border-slate-200"
                            >
                                Cambiar Fecha
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <ChevronUp size={14} className="text-slate-300" />
                    </div>
                </div>
            )}
        </div>
    );
}
