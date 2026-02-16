import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WeeklyProgress() {
    const { tasks } = useTasks();

    const data = useMemo(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Start Monday
        const end = endOfWeek(today, { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dayTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && isSameDay(parseISO(t.completedAt), day));
            // Since we don't track completedAt exactly in previous logic (just status), let's assume due date for now OR we should update TaskContext to track completion date.
            // For now, let's just count tasks due on that day that are completed? No that's wrong.
            // Let's count tasks due on that day as "Expected" and completed tasks as "Actual" if we tracked completion date.

            // Sim plified logic: Count tasks DUE on that day.
            const tasksDue = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));
            const completed = tasksDue.filter(t => t.status === 'completed').length;
            const total = tasksDue.length;

            return {
                name: format(day, 'EEE', { locale: es }),
                fullDate: format(day, 'd MMM'),
                completed,
                pending: total - completed,
                total
            };
        });
    }, [tasks]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Reporte Semanal</h2>
                <p className="text-slate-400 text-sm mt-1">Productividad y cumplimiento de objetivos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Tasa de Completitud Global</h3>
                    <div className="flex items-end items-baseline">
                        <span className="text-4xl font-bold text-white">{progress}%</span>
                        <span className="ml-2 text-sm text-slate-400">Total</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Chart Card */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
                    <h3 className="text-slate-400 text-sm font-medium mb-4">Progreso Diario (Tareas Vencimiento)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                itemStyle={{ color: '#cbd5e1' }}
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            />
                            <Bar dataKey="completed" name="Completadas" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="pending" name="Pendientes" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={30} opacity={0.3} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
