import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Calendar, Tag, Briefcase, User, Plus, Trash2, Users } from 'lucide-react';

import { format } from 'date-fns';

export default function TaskForm({ onClose, taskToEdit = null, initialDivision = 'personal', initialDate = null, initialSection = null }) {
    const { addTask, updateTask, subsections, addSection } = useTasks();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        division: initialDivision,
        section: '',
        dueDate: initialDate || format(new Date(), 'yyyy-MM-dd'), // Default to selected date or today
        priority: 'medium',
        status: 'pending',
        assignees: '' // New field for People
    });

    const [newSection, setNewSection] = useState('');
    const [showNewSectionInput, setShowNewSectionInput] = useState(false);

    // Initialize state
    useEffect(() => {
        if (taskToEdit) {
            setFormData({ ...taskToEdit });
        } else {
            // Set default section based on division or use initialSection
            const currentSubsections = subsections[initialDivision] || [];
            setFormData(prev => ({
                ...prev,
                division: initialDivision,
                section: initialSection || currentSubsections[0] || 'General'
            }));
        }
    }, [taskToEdit, initialDivision, subsections, initialSection]);

    // Update section when division changes manually
    const handleDivisionChange = (newDivision) => {
        const currentSubsections = subsections[newDivision] || [];
        setFormData(prev => ({
            ...prev,
            division: newDivision,
            section: currentSubsections[0] || 'General'
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            // Ensure status is correct based on edit mode
            status: taskToEdit ? formData.status : 'pending'
        };

        if (taskToEdit) {
            updateTask(taskToEdit.id, finalData);
        } else {
            addTask(finalData);
        }
        onClose();
    };

    const handleAddSection = () => {
        if (newSection.trim()) {
            addSection(formData.division, newSection.trim());
            setFormData(prev => ({ ...prev, section: newSection.trim() }));
            setNewSection('');
            setShowNewSectionInput(false);
        }
    };

    const currentSubsections = subsections[formData.division] || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    {/* Division Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <button
                            type="button"
                            onClick={() => handleDivisionChange('personal')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${formData.division === 'personal'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                        >
                            <User size={16} /> Personal
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDivisionChange('work')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${formData.division === 'work'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                        >
                            <Briefcase size={16} /> Trabajo
                        </button>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Título</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                            placeholder="¿Qué tienes que hacer?"
                        />
                    </div>

                    {/* Subsections & Priority Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Section */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Sección</label>
                            {!showNewSectionInput ? (
                                <div className="flex gap-2">
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 outline-none appearance-none"
                                    >
                                        {currentSubsections.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewSectionInput(true)}
                                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                                        title="Nueva sección"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                                    <input
                                        type="text"
                                        value={newSection}
                                        onChange={(e) => setNewSection(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-indigo-500 outline-none"
                                        placeholder="Nueva..."
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSection())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSection}
                                        className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewSectionInput(false)}
                                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl border border-slate-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Prioridad</label>
                            <div className="relative">
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 outline-none appearance-none"
                                >
                                    <option value="low">Baja (Azul)</option>
                                    <option value="medium">Media (Amarillo)</option>
                                    <option value="high">Alta (Rojo)</option>
                                </select>
                                <Tag size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Fecha Vencimiento</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                            />
                            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Assignees (Personas) */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Personas Relacionadas</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.assignees}
                                onChange={(e) => setFormData({ ...formData, assignees: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                                placeholder="Ej: Juan, María, Equipo de Diseño..."
                            />
                            <Users size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Notas / Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all h-24 resize-none placeholder:text-slate-700"
                            placeholder="Detalles adicionales..."
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-transparent hover:border-slate-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
