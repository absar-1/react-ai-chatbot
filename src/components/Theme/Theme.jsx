import styles from './Theme.module.css';
import { useState, useEffect } from 'react';

export function Theme(){
    const [theme, setTheme] = useState('light-dark');

    useEffect(() => {
        // Get saved theme from localStorage or default to system
        const savedTheme = localStorage.getItem('theme') || 'light-dark';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    function applyTheme(selectedTheme) {
        const meta = document.querySelector('meta[name="color-scheme"]');
        
        if (selectedTheme === 'light-dark') {
            // System theme - detect based on user preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            meta.setAttribute("content", prefersDark ? "dark" : "light");
        } else {
            // Manual theme selection
            meta.setAttribute("content", selectedTheme);
        }
        
        // Save to localStorage
        localStorage.setItem('theme', selectedTheme);
    }

    function handleValueChange(event){
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
        applyTheme(selectedTheme);
    }

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            if (theme === 'light-dark') {
                applyTheme('light-dark');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return(
        <div className={styles.Theme}>
            <span>Theme</span>
            <select value={theme} onChange={handleValueChange} className={styles.Selector}>
                <option value="light-dark">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    );
}