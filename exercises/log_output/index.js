const crypto = require("crypto");
const e = require("express");
const express = require("express");
const app = express();
const fs = require("fs");

const port = process.env.PORT || 3000;
const pingpong_url = process.env.PINGPONG_URL || "";

const instance_id = crypto.randomUUID();

app.get("/", async (req, res) => {
  let responseText = "<pre>";

  //file content: this text is from file
  try {
    const fileContent = fs.readFileSync("/app/config/config.txt", "utf-8").trim();
    responseText += `\nfile content: ${fileContent}`;
  } catch (error) {
    responseText += `\nfile content: Error reading file`;
  }
  //env variable: MESSAGE=hello world
  const message = process.env.MESSAGE || "No MESSAGE env variable set";
  responseText += `\nenv variable: MESSAGE=${message}`;

  // log + instance
  responseText += log();

  //pingpong fetch
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

  responseText += "\n</pre>";
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
