const express = require("express");
const { searchFiles } = require("../services/searchService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bucket = req.app.locals.bucket;

    const results = await searchFiles(bucket, {
      q: req.query.q,
      uploadedBy: req.query.uploadedBy,
      tag: req.query.tag,
      fileType: req.query.fileType,
    });

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Error fetching search results" });
  }
});

module.exports = router;
