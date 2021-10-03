const express = require("express");
const cors = require("cors");
const db = require("./src/database");

// Sync the database in the background
db.sync();

const app = express();

// Parse requests of content-type - application.json
app.use(express.json());

// Add cors support
app.use(cors());

// Implement routes here
require("./src/routes/user.routes.js")(express, app);

// Set port, listen for requests
const PORT = 4500;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
