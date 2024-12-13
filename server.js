const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const adminRoutes = require('./routes/admin');
const profRoutes = require('./routes/prof');
const attRoutes = require('./routes/attendanceRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);
// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/prof', profRoutes);
app.use('/api/attendance', attRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
