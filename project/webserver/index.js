const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Settings
const port = process.env.PORT || 3000;
const todoBackendUrl = process.env.TODO_BACKEND_URL || 'http://localhost:3001';
const cacheDir = process.env.CACHE_DIR || path.join(__dirname, '.cache');
const imageFile = path.join(cacheDir, 'current.jpg');
const metadataFile = path.join(cacheDir, 'metadata.json');

// Initialize
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, {recursive: true});
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper functions
async function fetchTodos() {
  const response = await fetch(`${todoBackendUrl}/todos`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function createTodo(text) {
  const response = await fetch(`${todoBackendUrl}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function fetchImage() {
  const response = await fetch('https://picsum.photos/1200');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(imageFile, Buffer.from(buffer));
  const metadata = { timestamp: Date.now() };
  fs.writeFileSync(metadataFile, JSON.stringify(metadata));
}

function getCurrentImage() {
  if (!fs.existsSync(imageFile) || !fs.existsSync(metadataFile)) {
    return null;
  }
  const minute = 60 * 1000;
  const metadata = JSON.parse(fs.readFileSync(metadataFile));
  const age = Date.now() - metadata.timestamp;
  console.log(`Image age: ${age / minute} minutes`);
  if (age < 10 * minute) { // 10 minutes
    return fs.readFileSync(imageFile);
  }
  return null;
}

// Routes

app.get('/', async (req, res) => {
  try {
    const todos = await fetchTodos();
    const todoList = todos.map(todo => `<li>${todo.text}</li>`).join('');

    res.send(`
      <html>
        <body>
          <h1>The project App</h1>
          <img src="/image" alt="Random Image">

          <form action="/todos" method="POST">
            <div>
              <input type="text" name="text" maxlength="140">
              <button type="submit">Create Todo</button>
            </div>
          </form>

          <ul>
            ${todoList}
          </ul>

          <p>DevOps with Kubernetes 2025</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Error fetching todos');
  }
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    await createTodo(text);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.get('/image', async (req, res) => {
  let image = getCurrentImage();
  if (!image) {
    await fetchImage();
    image = getCurrentImage();
  }
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(image);
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});