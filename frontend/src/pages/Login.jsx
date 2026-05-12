import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu.jsx';
import '../styles/login.css';

const LOGO_URL = 'https://storage.123fakturere.no/public/icons/diamond.png';
const FLAG_SE  = 'https://storage.123fakturere.no/public/flags/SE.png';
const FLAG_GB  = 'https://storage.123fakturere.no/public/flags/GB.png';
const BG_URL   = 'https://storage.123fakturera.se/public/wallpapers/sverige43.jpg';

const NAV_LINKS = [
  { key: 'nav.home',     label: 'Home',     href: '#' },
  { key: 'nav.pricing',  label: 'Pricing',  href: '#' },
  { key: 'nav.features', label: 'Features', href: '#' },
  { key: 'nav.about',    label: 'About',    href: '#' },
  { key: 'nav.contact',  label: 'Contact',  href: '#' },
];

const ERROR_MESSAGES = {
  'email.required': { sv: 'E-postadress krävs',              en: 'Email address is required' },
  'email.invalid':  { sv: 'Ange en giltig e-postadress',     en: 'Please enter a valid email address' },
  'pwd.required':   { sv: 'Lösenord krävs',                  en: 'Password is required' },
};

export default function Login() {
  const navigate = useNavigate();

  const [lang, setLang]           = useState('sv');
  const [t, setT]                 = useState({});
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [formError, setFormError] = useState('');
  const [touched, setTouched]     = useState({});

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/pricelist');
  }, [navigate]);

  useEffect(() => {
    fetch(`/api/translations/${lang}`)
      .then(r => r.json())
      .then(d => setT(d.translations || {}))
      .catch(() => setT({}));
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);

  function tr(key, fallback) {
    return t[key] || fallback || key;
  }

  // Returns error keys (not translated strings) so that switching language
  // instantly re-renders the correct text without re-running validation.
  function validate(field, value) {
    const errs = { ...errors };
    if (field === 'email') {
      if (!value.trim()) {
        errs.email = 'email.required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errs.email = 'email.invalid';
      } else {
        delete errs.email;
      }
    }
    if (field === 'password') {
      if (!value) {
        errs.password = 'pwd.required';
      } else {
        delete errs.password;
      }
    }
    setErrors(errs);
    return errs;
  }

  // Translate an error key using ERROR_MESSAGES, falling back to the key itself.
  function te(key) {
    return ERROR_MESSAGES[key]?.[lang] || key;
  }

  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field, field === 'email' ? email : password);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setTouched({ email: true, password: true });
    const errs = { ...validate('email', email), ...validate('password', password) };
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      remember
        ? localStorage.setItem('rememberedEmail', email)
        : localStorage.removeItem('rememberedEmail');

      navigate('/pricelist');
    } catch {
      setFormError('Unable to connect to the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-root" style={{ backgroundImage: `url(${BG_URL})` }}>
      <div className="login-overlay" />

      {/* ── Header ── */}
      <header className="login-header">
        <div className="login-header__inner">

          {/* Logo */}
          <a href="#" className="login-logo">
            <div className="login-logo__icon-wrap">
              <img src={LOGO_URL} alt="logo" className="login-logo__icon" />
            </div>
            <span className="login-logo__text">123 Fakturera</span>
          </a>

          {/* Desktop nav */}
          <nav className="login-nav" aria-label="Main navigation">
            {NAV_LINKS.map(l => (
              <a key={l.key} href={l.href} className="login-nav__link">
                {tr(l.key, l.label)}
              </a>
            ))}
          </nav>

          {/* Right side: lang + auth buttons + hamburger */}
          <div className="login-header__right">
            {/* Language switcher */}
            <div className="lang-switcher">
              <button
                className={`lang-btn ${lang === 'sv' ? 'active' : ''}`}
                onClick={() => setLang('sv')}
                title="Svenska"
              >
                <img src={FLAG_SE} alt="SV" />
                <span className="lang-label">SV</span>
              </button>
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                title="English"
              >
                <img src={FLAG_GB} alt="EN" />
                <span className="lang-label">EN</span>
              </button>
            </div>

            {/* Desktop auth CTAs */}
            <div className="header-ctas">
              <a href="#" className="header-cta-link">{tr('nav.login', 'Log in')}</a>
              <a href="#" className="header-cta-btn">{tr('nav.register', 'Register')}</a>
            </div>

            {/* Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <HamburgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={NAV_LINKS}
        tr={tr}
        lang={lang}
        setLang={setLang}
        flagSE={FLAG_SE}
        flagGB={FLAG_GB}
      />

      {/* ── Main / Card ── */}
      <main className="login-main">
        <div className="login-card">

          {/* Card logo */}
          <div className="login-card__logo">
            <img src={LOGO_URL} alt="123 Fakturera" />
          </div>

          <h1 className="login-card__title">{tr('login.title', 'Logga in')}</h1>
          <p className="login-card__subtitle">
            {tr('login.subtitle', 'Faktura- & bokföringsprogram')}
          </p>

          {/* Global error */}
          {formError && (
            <div className="form-banner form-banner--error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {formError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className={`form-group ${touched.email && errors.email ? 'has-error' : ''}`}>
              <label htmlFor="login-email" className="form-label">
                {tr('login.email', 'E-postadress')}
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (touched.email) validate('email', e.target.value); }}
                  onBlur={() => handleBlur('email')}
                  placeholder={tr('login.email', 'E-postadress')}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {touched.email && errors.email && (
                <p className="field-error">{te(errors.email)}</p>
              )}
            </div>

            {/* Password */}
            <div className={`form-group ${touched.password && errors.password ? 'has-error' : ''}`}>
              <label htmlFor="login-password" className="form-label">
                {tr('login.password', 'Lösenord')}
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) validate('password', e.target.value); }}
                  onBlur={() => handleBlur('password')}
                  placeholder={tr('login.password', 'Lösenord')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(p => !p)}
                  tabIndex={-1}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="field-error">{te(errors.password)}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span>{tr('login.remember_me', 'Kom ihåg mig')}</span>
              </label>
              <a href="#" className="forgot-link">
                {tr('login.forgot', 'Glömt lösenordet?')}
              </a>
            </div>

            <button
              type="submit"
              className={`login-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? <span className="btn-spinner" />
                : tr('login.button', 'Logga in')
              }
            </button>
          </form>

          {/* Divider */}
          <div className="card-divider">
            <span>{tr('login.no_account', 'Har du inget konto?')}</span>
          </div>

          {/* Register link */}
          <a href="#" className="register-link">
            {tr('login.register', 'Registrera dig gratis')}
          </a>

          {/* Terms */}
          <p className="terms-text">
            {tr('login.terms', 'Genom att logga in godkänner du våra')}{' '}
            <a href="#">{tr('login.terms_link', 'användarvillkor')}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
