import React from 'react';
import FadeIn from './FadeIn';

function AfCard({ children, className = '', ...props }) {
  return (
    <FadeIn>
      <div
        className={`af-card bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    </FadeIn>
  );
}

export default AfCard;