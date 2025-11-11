const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

var counter = 0;

// Root endpoint
app.get('/', (req, res) => {
  res.send(`ping ${counter}`);
  counter += 1
});

// Start the server
app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});