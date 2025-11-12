const crypto = require('crypto');
const fs = require('fs');

const log_file = process.env.LOG_FILE || "/tmp/logfile";

const instance_id = crypto.randomUUID();

function log(message = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${instance_id}: ${message}`;
  console.log(logMessage);
  fs.writeFileSync(log_file, logMessage);
  return logMessage;
}

log(`Application started. (log_file ${log_file})`);

setInterval(() => log('Interval log'), 5000);