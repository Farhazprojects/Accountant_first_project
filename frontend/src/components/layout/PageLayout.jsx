import React from 'react';
import FadeIn from '../ui/FadeIn';

export const PageLayout = ({ children, title, subtitle }) => {
  return (
    <div className="af-page">
      <FadeIn>
        {(title || subtitle) && (
          <header className="mb-24">
            {title && <h1>{title}</h1>}
            {subtitle && <p className="af-muted">{subtitle}</p>}
          </header>
        )}
        <main className="af-dashboard">
          {children}
        </main>
      </FadeIn>
    </div>
  );
};

export default PageLayout;