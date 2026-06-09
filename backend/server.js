import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection, initDatabase } from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      time: result.rows[0].now,
      service: 'BlocNote API'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: error.message
    });
  }
});

// Start server
const startServer = async () => {
  console.log('🔄 Testing database connection...');
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 BlocNote server running on http://localhost:${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
      console.log(`📅 Events endpoint: http://localhost:${PORT}/api/events`);
    });
  } else {
    console.error('❌ Cannot start server: Database connection failed');
    console.log('\n💡 Vérifiez votre fichier .env et que PostgreSQL est démarré');
    process.exit(1);
  }
};

startServer();
