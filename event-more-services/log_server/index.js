const crypto = require('crypto');
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const log_file = process.env.LOG_FILE || "/tmp/logfile";

const instance_id = crypto.randomUUID();

app.get('/', (req, res) => {
  console.log(`${new Date().toISOString()}: ${instance_id}: Received GET request on /`);
  try {
    const logContent = fs.readFileSync(log_file, 'utf8');
    res.send(logContent);
  } catch (error) {
    res.status(500).send('Error reading log file');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
