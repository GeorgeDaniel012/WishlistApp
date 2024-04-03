const express = require('express');
const app = express();
const PORT = 3000;

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
