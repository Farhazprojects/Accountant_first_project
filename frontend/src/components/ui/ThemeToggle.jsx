import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="af-btn af-btn-outline"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        width: '40px',
        height: '40px',
        padding: '0',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
