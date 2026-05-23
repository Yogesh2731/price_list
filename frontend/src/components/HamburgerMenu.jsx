import React, { useEffect } from 'react';
import '../styles/hamburger.css';

const LOGO_URL = 'https://storage.123fakturere.no/public/icons/diamond.png';

export default function HamburgerMenu({ open, onClose, navLinks, tr }) {

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`menu-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />

      <div className={`menu-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">

        {/* Header */}
        <div className="menu-drawer__header">
          <div className="menu-drawer__logo">
            <div className="menu-drawer__logo-icon">
              <img src={LOGO_URL} alt="logo" />
            </div>
            <span className="menu-drawer__title">123 Fakturera</span>
          </div>
          <button className="menu-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="menu-drawer__nav">
          {navLinks.map(l => (
            <a key={l.key} href={l.href} className="menu-drawer__link" onClick={onClose}>
              {tr(l.key, l.label)}
            </a>
          ))}
        </nav>

        <div className="menu-drawer__divider" />

        {/* CTA buttons */}
        <div className="menu-drawer__actions">
          <a href="#" className="menu-drawer__link menu-drawer__link--primary" onClick={onClose}>
            {tr('nav.login', 'Log in')}
          </a>
          <a href="#" className="menu-drawer__link menu-drawer__link--outline" onClick={onClose}>
            {tr('nav.register', 'Register')}
          </a>
        </div>
      </div>
    </>
  );
}
