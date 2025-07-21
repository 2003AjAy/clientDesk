require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Placeholder endpoint for form submissions
app.post('/api/submit', async (req, res) => {
  const { name, email, phone, projectType, requirements, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inquiries (name, email, phone, project_type, requirements, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, projectType, requirements, date]
    );
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: result.rows[0] });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ message: 'Failed to submit inquiry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 