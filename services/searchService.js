// This code provides a service for searching files in a MongoDB GridFS bucket based on various filters.
// It constructs a query based on the provided filters and returns the matching files as an array.
const searchFiles = async (bucket, filters) => {
  const { q, uploadedBy, tag, fileType } = filters;

  const conditions = [];

  if (q) {
    conditions.push({
      $or: [
        { filename: { $regex: q, $options: "i" } },
        { "metadata.description": { $regex: q, $options: "i" } },
        { "metadata.project": { $regex: q, $options: "i" } },
        { "metadata.tags": { $regex: q, $options: "i" } },
      ],
    });
  }

  if (uploadedBy) {
    conditions.push({
      "metadata.uploadedBy": { $regex: uploadedBy, $options: "i" },
    });
  }

  if (tag) {
    conditions.push({ "metadata.tags": { $regex: tag, $options: "i" } });
  }

  if (fileType) {
    conditions.push({ contentType: { $regex: fileType, $options: "i" } });
  }

  const query = conditions.length > 0 ? { $and: conditions } : {};

  return bucket.find(query).toArray();
}

module.exports = { searchFiles };
