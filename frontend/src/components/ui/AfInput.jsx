import React from 'react';

function AfInput({ label, name, type = 'text', value, onChange, placeholder, required, className = '', ...props }) {
  const inputStyles = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputStyles}
        {...props}
      />
    </div>
  );
}

export default AfInput;