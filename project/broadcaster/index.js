const { connect, StringCodec } = require('nats');
const https = require('https');

const natsUrl = process.env.NATS_URL || 'nats://nats:4222';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const port = process.env.PORT || 3002;

if (!slackWebhookUrl) {
  console.error('SLACK_WEBHOOK_URL environment variable is required');
  process.exit(1);
}

const sc = StringCodec();

async function sendToSlack(message) {
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

    const sub = nc.subscribe('todo.updates');
    (async () => {
      for await (const m of sub) {
        try {
          const data = JSON.parse(sc.decode(m.data));
          console.log('Received todo update:', data);

          let message;
          if (data.action === 'create') {
            message = `📝 New todo created: "${data.text}" (ID: ${data.id})`;
          } else if (data.action === 'update') {
            message = `✅ Todo updated: "${data.text}" - Status: ${data.done ? 'Done' : 'Pending'} (ID: ${data.id})`;
          } else {
            console.log('Unknown action:', data.action);
            continue;
          }

          await sendToSlack(message);
          console.log('Message sent to Slack successfully');
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