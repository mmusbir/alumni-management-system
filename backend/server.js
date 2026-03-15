require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const alumniRoutes = require('./routes/alumniRoutes');
const usahaRoutes = require('./routes/usahaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { bootstrapApp } = require('./config/bootstrap');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// â”€â”€â”€ Logger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// â”€â”€â”€ Security Middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow external CDN scripts and fonts
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Global rate limiter â€” 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak request, silakan coba lagi nanti.',
  },
});
app.use('/api', limiter);

// â”€â”€â”€ Body Parser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// â”€â”€â”€ Static Frontend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Serve the frontend folder from the parent directory
app.use(express.static(path.join(__dirname, '../frontend')));

// â”€â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use('/api', alumniRoutes);
app.use('/api', usahaRoutes);
app.use('/api', adminRoutes);

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/login.html'));
});

app.get('/admin/panel', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/dashboard.html'));
});

app.get('/pendaftaran', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pendaftaran.html'));
});

app.get('/direktori', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/direktori.html'));
});

app.get('/lapak', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/lapak.html'));
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'IKA SMANDA API is running ðŸš€' });
});

// â”€â”€â”€ 404 Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

// â”€â”€â”€ Global Error Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
  });
});

// â”€â”€â”€ Start Server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function startServer() {
  try {
    await bootstrapApp();
    console.log('Bootstrap selesai.');
  } catch (err) {
    console.error('Bootstrap gagal:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

module.exports = app;

