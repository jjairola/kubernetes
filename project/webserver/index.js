const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send(`Server started in port ${port}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});