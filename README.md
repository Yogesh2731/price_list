# Invoice Management Mini App

A full-stack web application built for practice, replicating the UI/UX of a real-world Swedish invoicing and accounting platform. The goal was to sharpen skills in building production-grade apps with a modern React frontend, a secure Node.js backend, and a relational PostgreSQL database — all deployed on a cloud platform.

---

## 🌐 Live Demo

**URL:** https://sow-trial-app.onrender.com
**Email:** admin@test.com
**Password:** password123

> ⚠️ Hosted on Render's free tier — the server may take ~30 seconds to wake up on first visit.

---

## 📸 Features

### Login Page
- Pixel-perfect replica of a modern SaaS login screen
- Responsive across all breakpoints — mobile portrait, mobile landscape, tablet, desktop
- Language switcher (🇸🇪 Swedish / 🇬🇧 English) — translations fetched from the database
- Inline field validation with real-time error messages (language-aware)
- Show/hide password toggle
- Remember me (persists email in localStorage)
- JWT authentication with 24-hour token expiry
- Hamburger menu with slide-in drawer on mobile/tablet

### Pricelist Page (Protected)
- JWT-protected route — redirects to login if token is missing or expired
- Session expiry modal — notifies the user mid-session instead of a silent redirect
- 20+ editable product rows with pill-shaped inputs
- Debounced auto-save (650ms) — changes save to the database as you type
- Per-row save feedback (saving / saved indicators)
- Responsive column visibility — different columns shown per breakpoint
- Sidebar navigation with icons
- Search / filter products in real time
- Dots (⋯) context menu per row
- Tab key navigation between inputs within a row
- Toast notification system (success / error / warning / info)
- Print stylesheet — hides UI chrome, shows clean product table

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.3.1 |
| Frontend | Vite | 5.3.4 |
| Frontend | React Router | 6.24.1 |
| Frontend | Vanilla CSS | — |
| Backend | Node.js | ≥ 18.0.0 |
| Backend | Express | 4.19.2 |
| Backend | JSON Web Token | 9.0.2 |
| Backend | bcrypt | 5.1.1 |
| Database | PostgreSQL | — |
| Database | node-postgres (pg) | 8.12.0 |
| Deployment | Render | — |

---

## 🗄️ Database Schema

```
users          — authenticated users (email, bcrypt password)
translations   — UI strings for EN and SV languages (key-value pairs)
products       — pricelist rows (code, name, unit, price, VAT, discount, stock)
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/Yogesh2731/price_list.git
cd price_list
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
# Edit .env and fill in your local PostgreSQL credentials
npm install
```

### 3. Set up the database
```bash
node db/setup.js
# Creates tables and seeds test data
```

### 4. Start the backend
```bash
npm run dev
# Runs on http://localhost:4000
```

### 5. Set up and start the frontend
```bash
cd ../frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 6. Open the app
Visit `http://localhost:5173` and log in with:
- **Email:** admin@test.com
- **Password:** password123

---

## 📁 Project Structure

```
price_list/
├── backend/
│   ├── db/
│   │   ├── index.js        # PostgreSQL pool (supports DATABASE_URL for cloud)
│   │   ├── schema.sql      # Table definitions + seed data
│   │   └── setup.js        # DB initialisation script
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js         # POST /api/auth/login, GET /api/auth/me
│   │   ├── products.js     # GET / PATCH /api/products (protected)
│   │   └── translations.js # GET /api/translations/:lang
│   ├── .env.example        # Environment variable template
│   └── server.js           # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── HamburgerMenu.jsx
│   │   │   └── SessionExpiredModal.jsx
│   │   ├── context/
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Pricelist.jsx
│   │   └── styles/
│   │       ├── global.css
│   │       ├── hamburger.css
│   │       ├── login.css
│   │       ├── modal.css
│   │       ├── pricelist.css
│   │       └── toast.css
│   └── vite.config.js
│
├── build.sh        # Render build script
├── render.yaml     # Render infrastructure as code
└── package.json    # Root build/start scripts
```

---

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=5432
DB_NAME=price_list
DB_USER=postgres
DB_PASSWORD=postgres
```

For cloud deployment, only `DATABASE_URL` is needed (auto-provided by Render).

---

## 📋 Development Log

| Day | Focus |
|-----|-------|
| Day 1 | Project scaffold — Vite + React, Express backend, PostgreSQL schema, JWT auth |
| Day 2 | Login page — full responsive UI, hamburger menu, language switcher, form validation |
| Day 3 | Pricelist page — sidebar, pill inputs, debounced auto-save, responsive columns |
| Day 4 | Polish — toast system, error boundary, session expiry modal, Tab navigation, print styles |
| Day 5 | Deployment — Render cloud hosting, production build pipeline, environment config |
