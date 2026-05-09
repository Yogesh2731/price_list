const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const translationsRoutes = require('./routes/translations');


const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extend: true}));

app.use('/api/auth', authRoutes);
app.use('/api/translations', translationsRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})