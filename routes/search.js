const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  if (!query) return res.json([]);

  try {
    const bucket = req.app.locals.bucket;

    const files = await bucket
      .find({
        $or: [
          { filename: { $regex: query, $options: "i" } },
          { contentType: { $regex: query, $options: "i" } },
          { "metadata.uploadedBy": { $regex: query, $options: "i" } },
          { "metadata.description": { $regex: query, $options: "i" } },
          { "metadata.project": { $regex: query, $options: "i" } },
          { "metadata.tags": { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    res.json(files);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Error fetching search results" });
  }
});

module.exports = router;
