const { Dropbox } = require('dropbox');
const fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch'); 

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

const uploadToDropbox = async (fileBuffer, filePath) => {
  try {
    // Upload file to Dropbox using the buffer (no need to save locally)
    const uploadResponse = await dbx.filesUpload({
      path: filePath,
      contents: fileBuffer,
    });

    // Generate a shared link for the uploaded file
    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResponse.result.path_lower,
    });

    // Dropbox returns URLs with `?dl=0`, change it to `?raw=1` for direct access
    const directLink = sharedLink.result.url.replace('?dl=0', '?raw=1');

    return directLink;  // Return the direct download link

  } catch (error) {
    console.error('Error uploading to Dropbox:', error);  
    throw new Error(`Error uploading file to Dropbox: ${error.message}`); 
  }
};

module.exports = { uploadToDropbox };
