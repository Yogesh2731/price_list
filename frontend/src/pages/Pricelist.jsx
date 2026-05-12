import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pricelist.css';
import { useToast } from '../context/ToastContext.jsx';
import SessionExpiredModal from '../components/SessionExpiredModal.jsx';

const FLAG_SE  = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB  = 'https://storage.123fakturere.no/public/flags/GB.png';
const LOGO_URL = 'https://storage.123fakturere.no/public/icons/diamond.png';

/* Debounce hook */
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

/* Sidebar items */
const SIDEBAR_ITEMS = [
  { label: 'Invoices',           icon: 'invoice' },
  { label: 'Customers',          icon: 'customers' },
  { label: 'My Business',        icon: 'business' },
  { label: 'Invoice Journal',    icon: 'journal' },
  { label: 'Price List',         icon: 'pricelist', active: true },
  { label: 'Multiple Invoicing', icon: 'multi' },
  { label: 'Unpaid Invoices',    icon: 'unpaid' },
  { label: 'Offer',              icon: 'offer' },
  { label: 'Inventory Control',  icon: 'inventory' },
  { label: 'Member Invoicing',   icon: 'member' },
  { label: 'Import/Export',      icon: 'import' },
];

function SidebarIcon({ type }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (type) {
    case 'invoice':    return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
    case 'customers':  return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'business':   return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'journal':    return <svg {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case 'pricelist':  return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'multi':      return <svg {...props}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
    case 'unpaid':     return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case 'offer':      return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case 'inventory':  return <svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case 'member':     return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'import':     return <svg {...props}><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>;
    default:           return null;
  }
}

/* Skeleton row─ */
function SkeletonRow() {
  return (
    <div className="pl-row pl-row--skeleton">
      <div className="pl-row__arrow" />
      <div className="pl-cell col-code"><div className="skel" /></div>
      <div className="pl-cell col-name"><div className="skel" /></div>
      <div className="pl-cell col-inprice desktop-col"><div className="skel" /></div>
      <div className="pl-cell col-price"><div className="skel" /></div>
      <div className="pl-cell col-unit landscape-col"><div className="skel" /></div>
      <div className="pl-cell col-stock landscape-col"><div className="skel" /></div>
      <div className="pl-cell col-desc desktop-col"><div className="skel" /></div>
      <div className="pl-cell col-dots" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════════ */
/* JWT expiry helper */
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch { return null; }
}

export default function Pricelist() {
  const navigate = useNavigate();
  const addToast = useToast();

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [searchCode, setSearchCode]       = useState('');
  const [searchName, setSearchName]       = useState('');
  const [activeRow, setActiveRow]         = useState(null);
  const [openMenu, setOpenMenu]           = useState(null);
  const [lang, setLang]                   = useState('en');
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [savingRows, setSavingRows]       = useState(new Set());
  const [savedRows, setSavedRows]         = useState(new Set());
  const [sessionExpired, setSessionExpired] = useState(false);

  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const activeRef = useRef(null);
  const expiryTimer = useRef(null);

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  function handle401(res) {
    if (res.status === 401) {
      setSessionExpired(true);
      return true;
    }
    return false;
  }

  /* DAY 4: Set expiry timer so modal shows exactly when token dies */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const expiry = getTokenExpiry(token);
    if (!expiry) return;
    const msLeft = expiry - Date.now();
    if (msLeft <= 0) { setSessionExpired(true); return; }
    expiryTimer.current = setTimeout(() => setSessionExpired(true), msLeft);
    return () => clearTimeout(expiryTimer.current);
  }, []);

  /* Fetch products */
  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', { headers: authHeaders() });
      if (handle401(res)) return;
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* Optimistic update + debounced save */
  function updateLocal(id, field, value) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }

  const saveField = useCallback(async (id, field, value) => {
    setSavingRows(prev => new Set(prev).add(id));
    setSavedRows(prev => { const s = new Set(prev); s.delete(id); return s; });
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ [field]: value }),
      });
      if (handle401(res)) return;
      if (res.ok) {
        setSavedRows(prev => new Set(prev).add(id));
        setTimeout(() => setSavedRows(prev => { const s = new Set(prev); s.delete(id); return s; }), 1800);
        // DAY 4: toast on save success
        addToast('Changes saved', 'success', 2000);
      } else {
        // DAY 4: toast on save failure
        addToast('Failed to save changes', 'error', 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
      // DAY 4: toast on network error
      addToast('Network error — changes not saved', 'error', 3500);
    } finally {
      setSavingRows(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }, [addToast]);

  const debouncedSave = useDebounce(saveField, 650);

  function handleFieldChange(id, field, value) {
    updateLocal(id, field, value);
    debouncedSave(id, field, value);
  }

  /* Close dots-menu on outside click */
  useEffect(() => {
    function onClick(e) {
      if (!e.target.closest('.col-dots')) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  /* Close sidebar on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setSidebarOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Lock body scroll when sidebar open (mobile) */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  /* Filtered list */
  const filtered = products.filter(p => {
    const mc = !searchCode || (p.product_code || '').toLowerCase().includes(searchCode.toLowerCase());
    const mn = !searchName || (p.name || '').toLowerCase().includes(searchName.toLowerCase());
    return mc && mn;
  });

  const initials = (user.name || user.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  /* Row state class */
  function rowClass(id) {
    let c = 'pl-row';
    if (activeRow === id) c += ' active';
    if (savingRows.has(id)) c += ' saving';
    if (savedRows.has(id)) c += ' saved';
    return c;
  }

  /* DAY 4: Tab key moves between inputs in the same row */
  function handlePillKeyDown(e, rowId, currentField) {
    if (e.key !== 'Tab') return;
    const visibleFields = ['product_code', 'name', 'in_price', 'price', 'unit', 'in_stock', 'description'];
    const visibleInputs = Array.from(
      document.querySelectorAll(`[data-rowid="${rowId}"] .pl-pill-input`)
    );
    const idx = visibleInputs.indexOf(e.target);
    if (e.shiftKey) {
      if (idx > 0) { e.preventDefault(); visibleInputs[idx - 1].focus(); }
    } else {
      if (idx < visibleInputs.length - 1) { e.preventDefault(); visibleInputs[idx + 1].focus(); }
    }
  }

  return (
    <>
    {/* DAY 4: Session expired modal */}
    {sessionExpired && <SessionExpiredModal onLogin={handleLogout} />}
    <div className="pl-root">

      {/* ══ Blue top bar ══════════════════════════════════════ */}
      <header className="pl-topbar">
        <div className="pl-topbar__left">
          <button className="pl-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <div className="pl-user-info desktop-only">
            <div className="pl-avatar">{initials}</div>
            <div className="pl-user-text">
              <span className="pl-user-name">{user.name || user.email}</span>
              <span className="pl-user-company">123 Fakturera</span>
            </div>
          </div>
        </div>

        <div className="pl-topbar__right">
          <button className={`pl-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
            <span className="pl-lang-label">English</span>
            <img src={FLAG_GB} alt="EN" className="pl-flag" />
          </button>
          <button className={`pl-lang-btn ${lang === 'sv' ? 'active' : ''}`} onClick={() => setLang('sv')}>
            <span className="pl-lang-label">Svenska</span>
            <img src={FLAG_SE} alt="SV" className="pl-flag" />
          </button>
        </div>
      </header>

      {/* ══ Layout ════════════════════════════════════════════ */}
      <div className="pl-layout">

        {/* Sidebar backdrop */}
        <div
          className={`pl-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`pl-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="pl-sidebar__header">
            <div className="pl-sidebar__logo">
              <img src={LOGO_URL} alt="logo" />
              <span>Menu</span>
            </div>
            <button className="pl-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="pl-sidebar__nav">
            {SIDEBAR_ITEMS.map(item => (
              <a
                key={item.label}
                href="#"
                className={`pl-sidebar__item ${item.active ? 'active' : ''}`}
                ref={item.active ? activeRef : null}
              >
                {item.active && <span className="pl-sidebar__dot" />}
                <SidebarIcon type={item.icon} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="pl-sidebar__footer">
            <button className="pl-sidebar__item pl-sidebar__logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="pl-main">

          {/* Toolbar */}
          <div className="pl-toolbar">
            <div className="pl-searches">
              {/* Article No search */}
              <div className="pl-search-pill">
                <input
                  type="text"
                  placeholder="Search Article No ..."
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                />
                {searchCode
                  ? <button className="pl-search-clear" onClick={() => setSearchCode('')} aria-label="Clear">✕</button>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                }
              </div>
              {/* Product name search */}
              <div className="pl-search-pill">
                <input
                  type="text"
                  placeholder="Search Product ..."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                />
                {searchName
                  ? <button className="pl-search-clear" onClick={() => setSearchName('')} aria-label="Clear">✕</button>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                }
              </div>
            </div>

            <div className="pl-actions">
              <button className="pl-action-btn pl-action-btn--add" title="New Product">
                <span className="pl-add-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </span>
                <span className="pl-action-label">New Product</span>
              </button>
              <button className="pl-action-btn" title="Print List">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span className="pl-action-label">Print List</span>
              </button>
              <button className="pl-action-btn pl-action-btn--toggle" title="Advanced mode">
                <span className="pl-toggle-track">
                  <span className="pl-toggle-thumb" />
                </span>
                <span className="pl-action-label">Advanced mode</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="pl-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
              <button className="pl-error-retry" onClick={fetchProducts}>Retry</button>
            </div>
          )}

          {/* Product list */}
          <div className="pl-list-container">

            {/* Sticky column headers */}
            <div className="pl-col-headers">
              <div className="pl-col-arrow-spacer" />
              <div className="pl-col-header col-code">
                Article No.
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>
              <div className="pl-col-header col-name">
                Product/Service
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>
              <div className="pl-col-header col-inprice desktop-col">In Price</div>
              <div className="pl-col-header col-price">Price</div>
              <div className="pl-col-header col-unit landscape-col">Unit</div>
              <div className="pl-col-header col-stock landscape-col">In Stock</div>
              <div className="pl-col-header col-desc desktop-col">Description</div>
              <div className="pl-col-header col-dots" />
            </div>

            {/* Skeleton rows while loading */}
            {loading && (
              <div className="pl-list-wrap">
                {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="pl-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dee2e6" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>No products found</p>
                {(searchCode || searchName) && (
                  <button className="pl-empty-clear" onClick={() => { setSearchCode(''); setSearchName(''); }}>
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Product rows */}
            {!loading && !error && filtered.length > 0 && (
              <div className="pl-list-wrap">
                {filtered.map(p => (
                  <div
                    key={p.id}
                    className={rowClass(p.id)}
                    data-rowid={p.id}
                    onClick={() => setActiveRow(p.id)}
                  >
                    {/* Arrow */}
                    <div className="pl-row__arrow">
                      {activeRow === p.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      )}
                    </div>

                    {/* Article No */}
                    <div className="pl-cell col-code">
                      <input
                        className={`pl-pill-input${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        value={p.product_code || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'product_code', e.target.value)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* Product/Service */}
                    <div className="pl-cell col-name">
                      <input
                        className={`pl-pill-input${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        value={p.name || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'name', e.target.value)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* In Price */}
                    <div className="pl-cell col-inprice desktop-col">
                      <input
                        className={`pl-pill-input number-pill${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        type="number"
                        value={p.in_price ?? ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'in_price', parseFloat(e.target.value) || 0)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* Price */}
                    <div className="pl-cell col-price">
                      <input
                        className={`pl-pill-input number-pill${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        type="number"
                        value={p.price ?? ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'price', parseFloat(e.target.value) || 0)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* Unit */}
                    <div className="pl-cell col-unit landscape-col">
                      <input
                        className={`pl-pill-input${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        value={p.unit || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'unit', e.target.value)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* In Stock */}
                    <div className="pl-cell col-stock landscape-col">
                      <input
                        className={`pl-pill-input number-pill${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        type="number"
                        value={p.in_stock ?? ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'in_stock', parseInt(e.target.value) || 0)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* Description */}
                    <div className="pl-cell col-desc desktop-col">
                      <input
                        className={`pl-pill-input${savingRows.has(p.id) ? ' saving' : ''}${savedRows.has(p.id) ? ' saved' : ''}`}
                        value={p.description || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'description', e.target.value)}
                        onKeyDown={e => handlePillKeyDown(e, p.id)}
                      />
                    </div>

                    {/* Three dots */}
                    <div className="pl-cell col-dots">
                      <button
                        className="pl-dots-btn"
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }}
                        aria-label="Row actions"
                      >
                        <span /><span /><span />
                      </button>
                      {openMenu === p.id && (
                        <div className="pl-dots-menu">
                          <button className="pl-dots-menu__item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>
                          <button className="pl-dots-menu__item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Duplicate
                          </button>
                          <div className="pl-dots-menu__divider" />
                          <button className="pl-dots-menu__item pl-dots-menu__item--danger">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result count */}
          {!loading && !error && filtered.length > 0 && (
            <div className="pl-result-count">
              {filtered.length} of {products.length} products
              {savingRows.size > 0 && <span className="pl-saving-badge">Saving…</span>}
            </div>
          )}

        </main>
      </div>
    </div>
    </>
  );
}
