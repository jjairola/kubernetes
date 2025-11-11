const crypto = require('crypto');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const instance_id = crypto.randomUUID();

function log(message = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${instance_id}: ${message}`;
  console.log(logMessage);
  return logMessage;
}

app.get('/', (req, res) => {
  const logMsg = log('Received GET request on /');
  res.send(`${logMsg}\n`);
});

app.listen(port, () => {
  log(`Server running on port ${port}`);
});

setInterval(() => log('Interval log'), 5000);