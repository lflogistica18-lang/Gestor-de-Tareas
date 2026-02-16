import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TaskContext = createContext();

export function useTasks() {
    return useContext(TaskContext);
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('tasks', []);
    const [categories, setCategories] = useLocalStorage('categories', ['General', 'Mantenimiento', 'Ventas', 'Logística']);

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

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories((prev) => [...prev, category]);
        }
    };

    const value = useMemo(() => ({
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addCategory
    }), [tasks, categories]);

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
