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

// Fetch all inquiries as projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY date DESC');
    // Map DB fields to Project type expected by frontend
    const projects = result.rows.map(row => ({
      id: row.id.toString(),
      clientName: row.name,
      email: row.email,
      phone: row.phone,
      projectType: row.project_type,
      requirements: row.requirements,
      status: row.status || 'Pending', // Default to Pending if not present
      createdAt: row.date,
      progress: row.progress || 0, // Default to 0 if not present
      timeline: [], // You can implement timeline logic if you have a related table
      notes: [],    // You can implement notes logic if you have a related table
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Fetch a single inquiry/project by ID
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM inquiries WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const row = result.rows[0];
    const project = {
      id: row.id.toString(),
      clientName: row.name,
      email: row.email,
      phone: row.phone,
      projectType: row.project_type,
      requirements: row.requirements,
      status: row.status || 'Pending',
      createdAt: row.date,
      progress: row.progress || 0,
      timeline: [],
      notes: [],
    };
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Delete a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', deletedProject: result.rows[0] });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Get project notes
app.get('/api/projects/:id/notes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM project_notes WHERE project_id = $1 ORDER BY timestamp DESC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project notes:', error);
    res.status(500).json({ message: 'Failed to fetch project notes' });
  }
});

// Add project note
app.post('/api/projects/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_notes (project_id, content) VALUES ($1, $2) RETURNING *',
      [id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding project note:', error);
    res.status(500).json({ message: 'Failed to add project note' });
  }
});

// Get project timeline
app.get('/api/projects/:id/timeline', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM project_timeline WHERE project_id = $1 ORDER BY date ASC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project timeline:', error);
    res.status(500).json({ message: 'Failed to fetch project timeline' });
  }
});

// Add project timeline item
app.post('/api/projects/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_timeline (project_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding project timeline item:', error);
    res.status(500).json({ message: 'Failed to add project timeline item' });
  }
});

// Update project timeline item status
app.put('/api/projects/:id/timeline/:taskId', async (req, res) => {
  const { id, taskId } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE project_timeline SET status = $1 WHERE id = $2 AND project_id = $3 RETURNING *',
      [status, taskId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Timeline item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project timeline item:', error);
    res.status(500).json({ message: 'Failed to update project timeline item' });
  }
});

// Update project status
app.put('/api/projects/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Failed to update project status' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 