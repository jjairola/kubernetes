const { connect, StringCodec } = require('nats');
const https = require('https');
require('dotenv').config();

const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const port = process.env.PORT || 3002;

if (!slackWebhookUrl) {
  console.log('SLACK_WEBHOOK_URL environment variable is required');
  console.log('Slack integration will be disabled.');
} else {
  console.log(`Slack webhook URL is set to: ${slackWebhookUrl}`);
}

const sc = StringCodec();

async function sendToSlack(message) {
  if (!slackWebhookUrl) return;
  
    return new Promise((resolve, reject) => {
    const data = JSON.stringify({ text: message });
    const url = new URL(slackWebhookUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Slack webhook failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    console.log('Connecting to NATS...');
    const nc = await connect({ servers: natsUrl });

    console.log('Connected to NATS. Subscribing to todo.updates...');

    // Use queue group to ensure each message is processed only once across replicas
    const sub = nc.subscribe('todo.updates', { queue: 'broadcaster-queue' });
    (async () => {
      for await (const m of sub) {
        try {
          const data = JSON.parse(sc.decode(m.data));
          console.log('Received todo update:', data);

          let message;
          if (data.action === 'create') {
            message = `New todo created: ${JSON.stringify(data)}`;
          } else if (data.action === 'update') {
            message = `Todo updated: ${JSON.stringify(data)}`;
          } else {
            console.log('Unknown action:', data.action);
            continue;
          }

          await sendToSlack(message);
        } catch (err) {
          console.error('Error processing message:', err);
        }
      }
    })();

    console.log(`Broadcaster service started on port ${port}`);
  } catch (err) {
    console.error('Failed to start broadcaster:', err);
    process.exit(1);
  }
}

main();