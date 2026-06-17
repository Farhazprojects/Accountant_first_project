import React from 'react';

export const FadeIn = ({ children, className = '', delay = 0 }) => {
  // If a delay is passed, start invisible until the animation triggers
  const style = delay ? { animationDelay: `${delay}ms`, opacity: 0 } : {};

  return (
    <div className={`fade-in ${className}`} style={style}>
      {children}
    </div>
  );
};

export default FadeIn;