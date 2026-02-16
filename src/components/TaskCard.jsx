import React from 'react';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

export default function TaskCard({ task, onEdit }) {
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
    const isDueSoon = task.dueDate && (isToday(new Date(task.dueDate)) || isTomorrow(new Date(task.dueDate)));

    const priorityColors = {
        low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    return (
        <div
            onClick={() => onEdit(task)}
            className={`
        bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10
        ${isOverdue ? 'border-red-500/50' : 'border-slate-800'}
      `}
        >
            {isOverdue && (
                <div className="flex items-center text-red-400 text-xs mb-2">
                    <AlertCircle size={14} className="mr-1" />
                    <span>Vencida</span>
                </div>
            )}

            <h3 className="font-semibold text-white mb-2">{task.title}</h3>

            {task.description && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
                {task.category && (
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-md border border-indigo-500/20">
                        {task.category}
                    </span>
                )}

                {task.priority && (
                    <span className={`px-2 py-1 text-xs rounded-md border ${priorityColors[task.priority]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
                {task.dueDate && (
                    <div className={`flex items-center ${isDueSoon && !isOverdue ? 'text-yellow-400' : ''}`}>
                        <Calendar size={14} className="mr-1" />
                        <span>{format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
                    </div>
                )}

                {task.assignedTo && task.assignedTo.length > 0 && (
                    <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{task.assignedTo.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
