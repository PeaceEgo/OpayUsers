const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const {PORT, MONGO_URI} = require('./configs/dotenv')



const app = express();

// Allow all origins
app.use(cors());  
app.use(express.json());

// Root route to handle GET requests to /
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Failed to connect to MongoDB:', err));

// Routes
app.use(userRoutes);

// Start server
app.listen(10000, () => {
  console.log(`Server running on port ${PORT}`);
});
