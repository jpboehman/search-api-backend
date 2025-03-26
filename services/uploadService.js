const multer = require("multer");
const { Readable } = require("stream");

// Use in-memory multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (req, res) => {
  const bucket = req.app.locals.bucket;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const readableStream = Readable.from(req.file.buffer);
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    const fileId = uploadStream.id;

    readableStream.pipe(uploadStream)
      .on("error", (err) => {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "File upload failed" });
      })
      .on("finish", () => {
        res.status(200).json({
          message: "File uploaded successfully",
          fileId: fileId,
          filename: req.file.originalname,
        });
      });
  } catch (err) {
    console.error("Unexpected Upload Error:", err);
    res.status(500).json({ error: "Unexpected upload error" });
  }
};

const getFiles = async (req, res) => {
  const bucket = req.app.locals.bucket;

  try {
    const files = await bucket.find().toArray();
    res.status(200).json(files);
  } catch (err) {
    console.error("Error getting files:", err);
    res.status(500).json({ error: "Failed to get files" });
  }
};

const downloadFile = async (req, res) => {
  const bucket = req.app.locals.bucket;
  const { ObjectId } = require("mongodb");

  try {
    const fileId = new ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", () => {
      res.status(404).json({ error: "File not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    res.status(400).json({ error: "Invalid file ID" });
  }
};

module.exports = {
  upload,
  uploadFile,
  getFiles,
  downloadFile,
};
// This code provides a service for handling file uploads to a MongoDB database using GridFS.
// It uses multer for file handling and streams to upload files directly to the database.