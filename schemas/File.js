const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    name: String,
    type: String,
    size: String,
    metadata: {
        uploadedBy: String,
        uploadedAt: {
            type: Date, default: Date.now()
        }
    }
})

module.exports = mongoose.model("File", FileSchema);
