const multer = require('multer');

// Use multer's memory storage to keep file in memory before sending to Dropbox
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
