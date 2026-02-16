import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { format, addDays } from 'date-fns';

const TaskContext = createContext();

export function useTasks() {
    return useContext(TaskContext);
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('tasks', []);

    // Subsections for each division
    const [subsections, setSubsections] = useLocalStorage('subsections', {
        personal: ['Casa', 'Salud', 'Finanzas', 'Personal'],
        work: ['Proyectos', 'Reuniones', 'Tareas', 'Seguimiento']
    });

    const addTask = (taskData) => {
        const newTask = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...taskData,
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const updateTask = (id, updates) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const addSection = (division, sectionName) => {
        setSubsections(prev => ({
            ...prev,
            [division]: [...(prev[division] || []), sectionName]
        }));
    };

    const deleteSection = (division, sectionName) => {
        if (!window.confirm(`¿Estás seguro de eliminar la sección "${sectionName}"? Las tareas pasarán a "General".`)) return;

        setSubsections(prev => ({
            ...prev,
            [division]: prev[division].filter(s => s !== sectionName)
        }));

        // Move tasks to General
        setTasks(prev => prev.map(task =>
            (task.division === division && task.section === sectionName)
                ? { ...task, section: 'General' }
                : task
        ));
    };

    const moveTaskToTomorrow = (taskId) => {
        const tomorrow = addDays(new Date(), 1);
        const tomorrowDate = format(tomorrow, 'yyyy-MM-dd');

        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        dueDate: tomorrowDate,
                        originalDate: task.originalDate || task.dueDate,
                        status: 'pending' // Keeps it pending but for tomorrow
                    }
                    : task
            )
        );
    };

    const moveTaskToToday = (taskId) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        updateTask(taskId, { dueDate: today });
    };

    const value = useMemo(() => ({
        tasks,
        subsections,
        addTask,
        updateTask,
        deleteTask,
        addSection,
        deleteSection,
        moveTaskToTomorrow,
        moveTaskToToday
    }), [tasks, subsections]);

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
