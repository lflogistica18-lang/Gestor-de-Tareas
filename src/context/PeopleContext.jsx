import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PeopleContext = createContext();

export function usePeople() {
    return useContext(PeopleContext);
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function PeopleProvider({ children }) {
    const [people, setPeople] = useLocalStorage('people', []);

    const addPerson = (personData) => {
        const newPerson = {
            id: generateId(),
            ...personData,
        };
        setPeople((prev) => [...prev, newPerson]);
    };

    const removePerson = (id) => {
        setPeople((prev) => prev.filter((person) => person.id !== id));
    };

    const value = useMemo(() => ({
        people,
        addPerson,
        removePerson
    }), [people]);

    return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}
