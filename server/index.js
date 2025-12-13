const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());

// Render-friendly PORT
const PORT = process.env.PORT || 8000;

// Single CORS (allow all for deploy)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
  })
);

// Load users from sample.json
let users = [];
if (fs.existsSync('./sample.json')) {
  const data = fs.readFileSync('./sample.json', 'utf8');
  users = data ? JSON.parse(data) : [];
}

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Add user
app.post('/users', (req, res) => {
  const { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const id = Date.now();
  users.push({ id, name, age, city });

  fs.writeFile('./sample.json', JSON.stringify(users), () => {
    res.json(users);
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((user) => user.id !== id);

  fs.writeFile('./sample.json', JSON.stringify(users), () => {
    res.json(users);
  });
});

// Update user
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, age, city } = req.body;

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[index] = { id, name, age, city };

  fs.writeFile('./sample.json', JSON.stringify(users), () => {
    res.json({ message: 'User updated', users });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
