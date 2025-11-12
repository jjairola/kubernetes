const express = require('express');
const crypto = require('crypto');
const { Client } = require('pg');
const app = express();

const port = process.env.PORT || 3001;
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'todo',
  user: process.env.DB_USER || 'todo_user',
  password: process.env.DB_PASSWORD || 'password',
});

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(36) PRIMARY KEY,
        text TEXT NOT NULL
      );
    `);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  res.on('finish', () => {
    console.log(`${timestamp} - ${req.method} ${req.url} - Status: ${res.statusCode}`);
  });
  next();
});

app.get('/todos', async (req, res) => {
  try {
    const result = await client.query('SELECT id, text FROM todos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (text.length > 140) {
    return res.status(400).json({ error: 'Todo text must be 140 characters or less' });
  }
  try {
    const id = crypto.randomUUID();
    await client.query('INSERT INTO todos (id, text) VALUES ($1, $2)', [id, text]);
    res.status(201).json({ id, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Todo backend server started on port ${port}`);
  connectToDB();
});