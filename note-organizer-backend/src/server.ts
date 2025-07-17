import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import path from 'path';

import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
// import categoryRoutes from './routes/categoryRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Static image uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
