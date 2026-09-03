require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const lockerRoutes = require('./routes/lockerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| Allow both Student and Admin Vercel frontends.
| origin: true reflects the requesting origin in the response.
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

app.use(
  '/generated',
  express.static(path.join(__dirname, 'generated'))
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Academic Document System backend is running'
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', authRoutes);

app.use('/api/requests', requestRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/verify', verifyRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api/messages', messageRoutes);

app.use('/api/locker', lockerRoutes);

app.use('/api/analytics', analyticsRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});