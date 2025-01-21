const express = require("express");
const cors = require("cors"); 
const bodyParser = require("body-parser");

const routes = require("./src/routes/routes");

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Use routes
app.use("/api", routes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Node API server started on port ${PORT}!`);
});
