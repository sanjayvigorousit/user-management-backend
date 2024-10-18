const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

//User
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// Company
const companyRoutes = require('./routes/company');
app.use('/api/company', companyRoutes);

//Sports
const sportRoutes = require('./routes/sport');
app.use('/api/sports', sportRoutes);

//UserActivity
const activityRoutes = require('./routes/userActivity');
app.use('/api/activity', activityRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
