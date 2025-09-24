const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Health check passed' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
