import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { usePeople } from '../context/PeopleContext';
import { X, Calendar, User, Tag } from 'lucide-react';

export default function TaskForm({ onClose, taskToEdit = null }) {
    const { addTask, updateTask, categories, addCategory } = useTasks();
    const { people } = usePeople();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: categories[0] || 'General',
        dueDate: '',
        assignedTo: [],
        priority: 'medium',
        status: 'pending' // Only relevant for edit
    });

    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                ...taskToEdit,
                assignedTo: taskToEdit.assignedTo || [] // Ensure array
            });
        }
    }, [taskToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskToEdit) {
            updateTask(taskToEdit.id, formData);
        } else {
            addTask(formData);
        }
        onClose();
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setFormData({ ...formData, category: newCategory.trim() });
            setNewCategory('');
            setShowNewCategoryInput(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">
                        {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            placeholder="Ej: Revisar inventario"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all h-24 resize-none"
                            placeholder="Detalles adicionales..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                                <Calendar size={14} className="mr-1" /> Vencimiento
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Prioridad</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                            <Tag size={14} className="mr-1" /> Categoría
                        </label>
                        {!showNewCategoryInput ? (
                            <div className="flex gap-2">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategoryInput(true)}
                                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                                    placeholder="Nueva categoría..."
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
                                >
                                    Ok
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategoryInput(false)}
                                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700"
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Assigned People */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                            <User size={14} className="mr-1" /> Asignar a
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 border border-slate-700 rounded-lg">
                            {people.length > 0 ? people.map(person => (
                                <label key={person.id} className="flex items-center space-x-2 p-1 hover:bg-slate-800 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.assignedTo.includes(person.id)}
                                        onChange={(e) => {
                                            const newAssigned = e.target.checked
                                                ? [...formData.assignedTo, person.id]
                                                : formData.assignedTo.filter(id => id !== person.id);
                                            setFormData({ ...formData, assignedTo: newAssigned });
                                        }}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-offset-slate-900"
                                    />
                                    <span className="text-sm text-slate-300">{person.name}</span>
                                </label>
                            )) : <span className="text-xs text-slate-600 col-span-2 text-center py-2">No hay personas registradas</span>}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                        >
                            {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
