require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Grid = require("gridfs-stream");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    app.locals.bucket = bucket;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error("MongoDB connection error:", err));

const conn = mongoose.connection;
let gfs; // Declare gfs globally

conn.once("open", () => {
  console.log("Connected to MongoDB");

  // Initialize GridFS when the connection is ready
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Store files in 'uploads' collection

  // Store in app.locals for access in routes
  app.locals.gfs = gfs;
});

// Routes
const searchRoutes = require("./routes/search");
const uploadRoutes = require("./routes/upload");

app.use("/api/search", searchRoutes);
app.use("/api/upload", uploadRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Search API Backend Running...");
});

