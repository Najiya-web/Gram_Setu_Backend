require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const feedback = require('./routes/feedback');
const registerController = require('./controllers/Register'); // Direct link to your controller

const port = process.env.PORT || 5000;
const app = express();

// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
 });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const atlasURI = process.env.MONGODB_URI;
mongoose.connect(atlasURI)
  .then(() => console.log("FINAL SYSTEM Cloud MongoDB Connected!"))
  .catch(err => console.error(err));

// Use Distributed Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedback);

// 🚀 DIRECT BINDING: This guarantees no route file/folder matching errors can happen
app.post('/api/userregister/register', registerController);

app.listen(port, () => console.log("FINAL SYSTEM Server running on port", port));
