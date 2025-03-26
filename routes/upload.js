const express = require("express");
const router = express.Router();

const {
  upload,
  uploadFile,
  getFiles,
  downloadFile,
} = require("../services/uploadService");

router.post("/", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.get("/download/:id", downloadFile);

module.exports = router;
