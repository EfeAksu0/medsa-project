'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'knight' | 'pro';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('knight');

    useEffect(() => {
        const savedTheme = localStorage.getItem('medysa_theme') as ThemeMode;
        if (savedTheme === 'pro' || savedTheme === 'knight') {
            setThemeState(savedTheme);
            if (savedTheme === 'pro') {
                document.body.classList.add('theme-pro');
            } else {
                document.body.classList.remove('theme-pro');
            }
        }
    }, []);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem('medysa_theme', newTheme);
        if (newTheme === 'pro') {
            document.body.classList.add('theme-pro');
        } else {
            document.body.classList.remove('theme-pro');
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'knight' ? 'pro' : 'knight';
        setTheme(nextTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
