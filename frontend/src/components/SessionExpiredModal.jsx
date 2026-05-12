import React from 'react';
import '../styles/modal.css';

export default function SessionExpiredModal({ onLogin }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box" role="alertdialog" aria-modal="true" aria-labelledby="session-title">
        <div className="modal-icon modal-icon--warning">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 id="session-title" className="modal-title">Session Expired</h2>
        <p className="modal-body">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        <button className="modal-btn" onClick={onLogin}>
          Log in again
        </button>
      </div>
    </div>
  );
}
