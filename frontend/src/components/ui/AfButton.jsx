import React from 'react';
import { Link } from 'react-router-dom';

function AfButton({ children, variant = 'primary', as = 'button', to, href, className = '', disabled, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-700',
  };

  const classNames = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  if (as === 'link' && to) {
    return <Link to={to} className={classNames} {...props}>{children}</Link>;
  }

  if (as === 'a' && href) {
    return <a href={href} className={classNames} {...props}>{children}</a>;
  }

  return (
    <button type="button" className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default AfButton;