import { useState, useEffect } from 'react';

/**
 * Hook to manage state synchronized with localStorage.
 * @param {string} key - The key for localStorage.
 * @param {any} initialValue - The initial value if key doesn't exist.
 * @returns {[any, Function]} - State and setter function.
 */
export function useLocalStorage(key, initialValue) {
    // Initialize state
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}
