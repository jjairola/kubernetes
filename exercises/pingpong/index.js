const fs = require('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const pingpong_file = process.env.PINGPONG_FILE || "";

app.use(express.json());

var counter = 0;

// Root endpoint
app.get('/', (req, res) => {
  res.send(`ping ${counter}`);
  counter += 1
  if (pingpong_file) {
      fs.writeFileSync(pingpong_file, `Ping / Pongs: ${counter}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started in port ${port}`);
  console.log(`Pingpong file: ${pingpong_file}`)
});