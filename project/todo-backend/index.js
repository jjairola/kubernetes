const express = require('express');
const crypto = require('crypto');
const { Pool } = require('pg');
const app = express();

const port = process.env.PORT || 3001;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'todo',
  user: process.env.DB_USER || 'todo_user',
  password: process.env.DB_PASSWORD || 'password',
});

async function connectToDB(retries = 5, delay = 3000) {
  for (let i = 1; i < retries + 1; i++) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL');
      await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id VARCHAR(36) PRIMARY KEY,
          text TEXT NOT NULL,
          done BOOLEAN DEFAULT FALSE
        );
      `);
      client.release();
      console.log('Table created or already exists');
      return;
    } catch (err) {
      const breaker = delay * i;
      console.error(`Connection attempt ${i}/${retries} failed. Retrying ${breaker}` );
      await new Promise(resolve => setTimeout(resolve, breaker));
    }
  }
  throw new Error('Failed to connect to database after retries');
}

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  res.on('finish', () => {
    console.log(`${timestamp} - ${req.method} ${req.url} - Status: ${res.statusCode}`);
  });
  next();
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: 'Database connection failed' });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, text, done FROM todos');

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
    await pool.query('INSERT INTO todos (id, text, done) VALUES ($1, $2, $3)', [id, text, false]);
    res.status(201).json({ id, text, done: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  if (typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be a boolean' });
  }
  try {
    const result = await pool.query('UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, text, done', [done, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, async () => {
  try {
    console.log(`Todo backend server started on port ${port}`);
    await connectToDB();
  } catch (err) {
    console.error('Failed to start server due to DB connection.');
    process.exit(1);
  }
});