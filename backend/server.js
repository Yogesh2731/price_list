const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
require('dotenv').config();

const pool               = require('./db/index');
const authRoutes         = require('./routes/auth');
const translationsRoutes = require('./routes/translations');
const productsRoutes     = require('./routes/products');

const app  = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

/* CORS
   Dev  : allow Vite dev server on 5173 / 3000
   Prod : allow FRONTEND_URL env var, or reflect any origin
          (safe because frontend is served from same domain)
------------------------------------------------------------ */
const corsOrigin = isProd
  ? (process.env.FRONTEND_URL || true)
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* API Routes */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',         authRoutes);
app.use('/api/translations', translationsRoutes);
app.use('/api/products',     productsRoutes);

/* Serve React build in production */
if (isProd) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  // SPA fallback — any non-API route serves index.html
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

/* Global error handler */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* Auto-init DB schema, then start server */
async function initDB() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ DB schema verified / initialized');
  } catch (err) {
    console.error('⚠️  DB init warning:', err.message);
    // Non-fatal — server still starts even if schema SQL has issues
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (isProd) console.log('   Serving React build from frontend/dist');
  });
});
