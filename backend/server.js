// Load and validate environment variables
require('./config/env');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PORT, NODE_ENV } = require('./config/env');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const donationRoutes = require('./routes/donations');
const userRoutes = require('./routes/users');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
// Note: Body parsers are NOT applied globally to avoid conflicts with multer
// They will be applied per-route as needed

// Health check route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Auth routes (multer is applied in the route file for signup)
app.use('/api/auth', authRoutes);

// Admin routes (protected by admin authentication middleware)
app.use('/api/admin', adminRoutes);

// Donation routes (for image upload and AI analysis)
app.use('/api/donations', donationRoutes);

// User routes (for user profile updates)
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'file', message: 'File too large. Maximum size is 10MB' }],
      });
    }
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});
