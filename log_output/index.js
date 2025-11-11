const crypto = require('crypto');

const instance_id = crypto.randomUUID();

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${instance_id}`);
}

log();

setInterval(log, 5000);