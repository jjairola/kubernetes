const express = require("express");
const { Client } = require("pg");
const app = express();

const port = process.env.PORT || 3000;
const pathPrefix = process.env.PATH_PREFIX || "";

const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "pingpong",
  user: process.env.DB_USER || "pingpong",
  password: process.env.DB_PASSWORD || "password",
};
const client = new Client(databaseConfig);

client.connect();

app.use(express.json());

let counter = 0;

// Initialize counter from database
async function initCounter() {
  try {
    const result = await client.query("SELECT value FROM counter WHERE id = 1");
    if (result.rows.length > 0) {
      counter = result.rows[0].value;
    } else {
      await client.query("INSERT INTO counter (id, value) VALUES (1, 0)");
    }
  } catch (err) {
    console.error("Error initializing counter:", err);
    // Create table if it doesn't exist
    await client.query(
      "CREATE TABLE IF NOT EXISTS counter (id SERIAL PRIMARY KEY, value INTEGER)"
    );
    await client.query("INSERT INTO counter (id, value) VALUES (1, 0)");
  }
}

initCounter();

if (pathPrefix !== "") {
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
}

// Pingpong endpoint
app.get(pathPrefix + "/", async (req, res) => {
  try {
    counter += 1;
    await client.query("UPDATE counter SET value = $1 WHERE id = 1", [counter]);
    res.send(`${counter}`);
  } catch (err) {
    console.error("Error updating counter:", err);
    res.status(500).send("Error updating counter");
  }
});

// Readiness endpoint
app.get(pathPrefix + "/ready", async (req, res) => {
  try {
    await client.query("SELECT 1");
    res.send("OK");
  } catch (err) {
    console.error("DB not ready:", err);
    res.status(500).send("Not Ready");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started in port ${port}`);
  const { password, ...rest } = databaseConfig;
  console.log(`Database config: ${JSON.stringify(rest)}`);
});
