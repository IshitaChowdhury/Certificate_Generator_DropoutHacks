const express = require('express');
const cors = require('cors');
const path = require('path');
const certificateRoutes = require('./routes/certificate');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve generated certificates as static files
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Routes
app.use('/api', certificateRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DropOutHacks Certificate Generator API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
