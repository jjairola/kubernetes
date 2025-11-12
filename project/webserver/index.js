const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const https = require('https');

const port = process.env.PORT || 3000;
const cacheDir = path.join(__dirname, '.cache');
const imageFile = path.join(cacheDir, 'current.jpg');
const metadataFile = path.join(cacheDir, 'metadata.json');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, {recursive: true});
}

app.use(express.json());

async function fetchImage() {
  return new Promise((resolve, reject) => {
    const fetchImageFromUrl = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchImageFromUrl(res.headers.location);
          return;
        }
        const data = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(data);
          fs.writeFileSync(imageFile, buffer);
          const metadata = { timestamp: Date.now() };
          fs.writeFileSync(metadataFile, JSON.stringify(metadata));
          resolve();
        });
      }).on('error', reject);
    };
    fetchImageFromUrl('https://picsum.photos/1200');
  });
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

app.get('/', (req, res) => {
  const todos = [
    'Learn DevOps with Kubernetes',
    'Build a todo app',
    'Deploy to production'
  ];

  const todoList = todos.map(todo => `<li>${todo}</li>`).join('');

  res.send(`
    <html>
      <body>
        <h1>The project App</h1>
        <img src="/image" alt="Random Image">

        <div>
          <input type="text" id="todoInput" maxlength="140">
          <button onclick="addTodo()">Create Todo</button>
        </div>

        <ul>
          ${todoList}
        </ul>

        <script>
          function addTodo() {
            const input = document.getElementById('todoInput');
            if (input.value.trim() !== '') {
              alert('Todo added: ' + input.value);
              input.value = '';
            }
          }
        </script>

        <p>DevOps with Kubernetes 2025</p>
      </body>
    </html>
  `);
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