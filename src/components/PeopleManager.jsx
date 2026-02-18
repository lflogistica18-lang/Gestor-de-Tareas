import React, { useState } from 'react';
import { usePeople } from '../context/PeopleContext';
import { User, Plus, Trash2 } from 'lucide-react';

export default function PeopleManager() {
    const { people, addPerson, removePerson } = usePeople();
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            addPerson({
                name: newName.trim(),
                role: newRole.trim() || 'Operario'
            });
            setNewName('');
            setNewRole('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Gestión de Personas</h2>
                <p className="text-slate-400 text-sm mt-1">Administra el equipo y asigna roles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Agregar Persona</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                required
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#893101]/50 outline-none transition-all"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Rol</label>
                            <input
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#893101]/50 outline-none transition-all"
                                placeholder="Ej: Operario"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-4 py-2 bg-[#893101] hover:bg-[#A03B05] text-white rounded-lg font-medium shadow-lg shadow-[#893101]/20 transition-all hover:-translate-y-0.5"
                        >
                            <Plus size={18} className="mr-2" />
                            Agregar
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Equipo ({people.length})</h3>

                    {people.length > 0 ? (
                        <div className="space-y-3">
                            {people.map(person => (
                                <div key={person.id} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[#893101]/10 rounded-full flex items-center justify-center text-[#B8510A]">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200">{person.name}</p>
                                            <p className="text-xs text-slate-500">{person.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removePerson(person.id)}
                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>No hay personas registradas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
