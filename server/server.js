// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
  res.send('ClientDesk API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// This code sets up a basic Express server with CORS and JSON parsing middleware.
// It listens on a specified port (defaulting to 5000) and responds with a