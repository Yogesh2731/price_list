import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pricelist.css';

const FLAG_SE  = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB  = 'https://storage.123fakturere.no/public/flags/GB.png';
const LOGO_URL = 'https://storage.123fakturere.no/public/icons/diamond.png';

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const SIDEBAR_ITEMS = [
  { label: 'Invoices',          icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  { label: 'Customers',         icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
  { label: 'My Business',       icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { label: 'Invoice Journal',   icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  { label: 'Price List',        icon: 'M3 3h18 M3 9h18 M3 15h18 M3 21h18', active: true },
  { label: 'Multiple Invoicing',icon: 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3' },
  { label: 'Unpaid Invoices',   icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01' },
  { label: 'Offer',             icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01' },
  { label: 'Inventory Control', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  { label: 'Member Invoicing',  icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3z M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z M8 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z M16 13c-.29 0-.62.02-.97.05C16.19 13.89 17 15.02 17 17v2h7v-2c0-2.66-5.33-4-8-4z' },
  { label: 'Import/Export',     icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12' },
];

export default function Pricelist() {
  const navigate = useNavigate();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [activeRow, setActiveRow]   = useState(null);
  const [openMenu, setOpenMenu]     = useState(null);
  const [lang, setLang]             = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products', { headers: authHeaders() });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function updateLocal(id, field, value) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }

  const saveField = useCallback(async (id, field, value) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ [field]: value }),
      });
      if (res.status === 401) handleLogout();
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, []);

  const debouncedSave = useDebounce(saveField, 600);

  function handleFieldChange(id, field, value) {
    updateLocal(id, field, value);
    debouncedSave(id, field, value);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // Close dot-menu on outside click
  useEffect(() => {
    function handleClick() { setOpenMenu(null); }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filtered = products.filter(p => {
    const matchCode = searchCode === '' ||
      (p.product_code && p.product_code.toLowerCase().includes(searchCode.toLowerCase()));
    const matchName = searchName === '' ||
      p.name.toLowerCase().includes(searchName.toLowerCase());
    return matchCode && matchName;
  });

  const initials = (user.name || user.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="pl-root">

      {/* ── Blue top bar ── */}
      <header className="pl-topbar">
        <div className="pl-topbar__left">
          {/* Hamburger */}
          <button className="pl-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>

          {/* Avatar + name (desktop only) */}
          <div className="pl-user-info desktop-only">
            <div className="pl-avatar">{initials}</div>
            <div className="pl-user-text">
              <span className="pl-user-name">{user.name || user.email}</span>
              <span className="pl-user-company">123 Fakturera</span>
            </div>
          </div>
        </div>

        <div className="pl-topbar__right">
          <button
            className={`pl-lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            <span className="pl-lang-label">English</span>
            <img src={FLAG_GB} alt="EN" className="pl-flag" />
          </button>
          <button
            className={`pl-lang-btn ${lang === 'sv' ? 'active' : ''}`}
            onClick={() => setLang('sv')}
          >
            <span className="pl-lang-label">Svenska</span>
            <img src={FLAG_SE} alt="SV" className="pl-flag" />
          </button>
        </div>
      </header>

      {/* ── Layout wrapper ── */}
      <div className="pl-layout">

        {/* ── Sidebar backdrop (mobile) ── */}
        <div
          className={`pl-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Left sidebar ── */}
        <aside className={`pl-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="pl-sidebar__header">
            <span>Menu</span>
            <button className="pl-sidebar__close" onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="pl-sidebar__nav">
            {SIDEBAR_ITEMS.map((item) => (
              <a key={item.label} href="#" className={`pl-sidebar__item ${item.active ? 'active' : ''}`}>
                {item.active && <span className="pl-sidebar__dot" />}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon.split(' M').map((d, i) => (
                    <path key={i} d={i === 0 ? d : 'M' + d} />
                  ))}
                </svg>
                <span>{item.label}</span>
              </a>
            ))}
            <a href="#" className="pl-sidebar__item pl-sidebar__logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log out</span>
            </a>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="pl-main">

          {/* Search + actions row */}
          <div className="pl-toolbar">
            <div className="pl-searches">
              <div className="pl-search-pill">
                <input
                  type="text"
                  placeholder="Search Article No ..."
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="pl-search-pill">
                <input
                  type="text"
                  placeholder="Search Product ..."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            <div className="pl-actions">
              <button className="pl-action-btn pl-action-btn--add" title="New Product">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="pl-action-label">New Product</span>
              </button>
              <button className="pl-action-btn" title="Print List">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span className="pl-action-label">Print List</span>
              </button>
              <button className="pl-action-btn" title="Advanced mode">
                <svg width="28" height="16" viewBox="0 0 44 24" fill="none">
                  <rect x="0" y="0" width="44" height="24" rx="12" fill="#2196f3" />
                  <circle cx="32" cy="12" r="9" fill="white" />
                </svg>
                <span className="pl-action-label">Advanced mode</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="pl-error">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="pl-loading">
              <div className="pl-spinner" />
              <p>Loading...</p>
            </div>
          )}

          {/* Product list */}
          {!loading && !error && (
            <div className="pl-list-wrap">
              {/* Column headers */}
              <div className="pl-col-headers">
                <div className="pl-col-arrow-spacer" />
                <div className="pl-col-header col-code">
                  Article No.
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <div className="pl-col-header col-name">
                  Product/Service
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <div className="pl-col-header col-inprice desktop-col">In Price</div>
                <div className="pl-col-header col-price">Price</div>
                <div className="pl-col-header col-unit landscape-col">Unit</div>
                <div className="pl-col-header col-stock landscape-col">In Stock</div>
                <div className="pl-col-header col-desc desktop-col">Description</div>
                <div className="pl-col-header col-dots" />
              </div>

              {/* Rows */}
              {filtered.length === 0 ? (
                <div className="pl-empty">No products found</div>
              ) : (
                filtered.map(p => (
                  <div
                    key={p.id}
                    className={`pl-row ${activeRow === p.id ? 'active' : ''}`}
                    onClick={() => setActiveRow(p.id)}
                  >
                    {/* Arrow indicator */}
                    <div className="pl-row__arrow">
                      {activeRow === p.id && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </div>

                    {/* Article No */}
                    <div className="pl-cell col-code">
                      <input
                        className="pl-pill-input"
                        value={p.product_code || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'product_code', e.target.value)}
                      />
                    </div>

                    {/* Product/Service */}
                    <div className="pl-cell col-name">
                      <input
                        className="pl-pill-input"
                        value={p.name || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'name', e.target.value)}
                      />
                    </div>

                    {/* In Price (desktop only) */}
                    <div className="pl-cell col-inprice desktop-col">
                      <input
                        className="pl-pill-input number-pill"
                        type="number"
                        value={p.in_price || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'in_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Price */}
                    <div className="pl-cell col-price">
                      <input
                        className="pl-pill-input number-pill"
                        type="number"
                        value={p.price || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Unit (landscape+) */}
                    <div className="pl-cell col-unit landscape-col">
                      <input
                        className="pl-pill-input"
                        value={p.unit || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'unit', e.target.value)}
                      />
                    </div>

                    {/* In Stock (landscape+) */}
                    <div className="pl-cell col-stock landscape-col">
                      <input
                        className="pl-pill-input number-pill"
                        type="number"
                        value={p.in_stock || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'in_stock', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    {/* Description (desktop only) */}
                    <div className="pl-cell col-desc desktop-col">
                      <input
                        className="pl-pill-input"
                        value={p.description || ''}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleFieldChange(p.id, 'description', e.target.value)}
                      />
                    </div>

                    {/* Three dots menu */}
                    <div className="pl-cell col-dots">
                      <button
                        className="pl-dots-btn"
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }}
                      >
                        <span /><span /><span />
                      </button>
                      {openMenu === p.id && (
                        <div className="pl-dots-menu">
                          <button className="pl-dots-menu__item">Edit</button>
                          <button className="pl-dots-menu__item">Duplicate</button>
                          <button className="pl-dots-menu__item pl-dots-menu__item--danger">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
