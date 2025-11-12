const crypto = require("crypto");
const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
const log_file = process.env.LOG_FILE || "/tmp/logfile";
const pingpong_file = process.env.PINGPONG_FILE || "";

const instance_id = crypto.randomUUID();


app.get("/", (req, res) => {
  let responseText = "";
  console.log(
    `${new Date().toISOString()}: ${instance_id}: Received GET request on /`
  );

  try {
    log_output = fs.readFileSync(log_file, "utf8");
    responseText += log_output + "\n";
  } catch (error) {
    res.status(500).send("Error reading log file");
  }

  if (pingpong_file) {
    try {
      pingpong_output = fs.readFileSync(pingpong_file, "utf8");
      responseText += pingpong_output + "\n";
    } catch (error) {
      res.status(500).send("Error reading pingpong file");
    }
  }

  res.send(responseText);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
