import React from 'react';
import FadeIn from './FadeIn';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry here
    console.error('[React UI Crash]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    // Attempt to recover by clearing the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="af-page" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'var(--af-bg)',
            padding: '20px'
          }}
        >
          <FadeIn className="af-card" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--af-danger)', marginBottom: '16px' }}>
              Something went wrong.
            </h1>
            <p className="af-muted" style={{ marginBottom: '24px' }}>
              We encountered an unexpected issue while loading this page. 
            </p>
            
            <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px', textAlign: 'left', overflowX: 'auto', marginBottom: '24px' }}>
              <code style={{ fontSize: '12px', color: '#334155' }}>
                {this.state.error && this.state.error.toString()}
              </code>
            </div>

            <button 
              className="af-btn af-btn-primary hover-lift" 
              onClick={this.handleReset}
            >
              Refresh Application
            </button>
          </FadeIn>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default GlobalErrorBoundary;