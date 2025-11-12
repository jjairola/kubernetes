const crypto = require("crypto");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const pingpong_url = process.env.PINGPONG_URL || "";

const instance_id = crypto.randomUUID();

app.get("/", async (req, res) => {
  let responseText = log();

  if (pingpong_url) {
    try {
      const response = await fetch(pingpong_url);
      const text = await response.text();
      console.log("Fetched data:", text);
      const parsedNumber = parseInt(text.replace(/\D/g, ""));
      responseText += "\nPing / Pongs: " + parsedNumber;
    } catch (error) {
      console.log(`Error fetching pingpong URL: ${error.message}`);
      responseText += "\nPing / Pongs: Error";
    }
  }

  res.send(responseText);
});

function log(message = "") {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${instance_id}: ${message}`;
  return logMessage;
}

app.listen(port, () => {
  console.log(log(`Server running on port ${port}`));
  console.log(log(`Pingpong URL: ${pingpong_url}`));
});

setInterval(() => console.log(log("Interval log")), 5000);
