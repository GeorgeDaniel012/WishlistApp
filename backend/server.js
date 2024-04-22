const express = require('express');
const bodyParser = require('body-parser');

const wishlistRoutes = require('./routers/wishlistRoutes.js')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.use('/wishlist', wishlistRoutes);

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
