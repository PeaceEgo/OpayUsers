const { Dropbox } = require('dropbox');
const fs = require('fs');
require('dotenv').config();

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

const uploadToDropbox = async (filePath, dropboxPath) => {
  try {
    const fileContent = fs.readFileSync(filePath);

    // Upload the file to Dropbox
    const response = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileContent,
    });

    // Generate a shared link for the uploaded file
    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: response.result.path_lower,
    });

    // Dropbox returns URLs with `?dl=0`, change it to `?raw=1` for direct access
    return sharedLink.result.url.replace('?dl=0', '?raw=1');
  } catch (error) {
    console.error('Error uploading to Dropbox:', error);
    throw new Error('Failed to upload file to Dropbox.');
  }
};

module.exports = { uploadToDropbox };
