const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

app.get('/tasks', (req, res) => {
  res.json({ message: 'Fetching tasks...' });
});

app.get('/users', (req, res) => {
  res.json({ message: 'Fetching users...' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
