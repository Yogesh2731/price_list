import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err.message || 'Unknown error' };
  }

  componentDidCatch(err, info) {
    console.error('ErrorBoundary caught:', err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif', padding: '2rem', background: '#f8fafc',
        }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', textAlign: 'center', maxWidth: 360 }}>
            {this.state.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#2196f3', color: '#fff', border: 'none',
              padding: '0.6rem 1.5rem', borderRadius: '8px',
              fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
