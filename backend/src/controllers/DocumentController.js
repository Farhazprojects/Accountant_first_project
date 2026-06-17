const S3Service = require('../services/S3Service');
// Assuming you have a Document model set up similarly to our previous models
const { Document } = require('../models'); 

const DocumentController = {
  async uploadDocument(req, res, next) {
    try {
      const { clientId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No document file provided.' });
      }

      if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required to upload a document.' });
      }

      // Push the file buffer to S3
      const s3Data = await S3Service.uploadToS3(file, clientId);

      // Save the reference to the database
      // (Assuming a Document model exists based on your requirements)
      const newDocument = await Document.create({
        clientId,
        filename: s3Data.filename,
        s3Key: s3Data.key,
        mimeType: s3Data.mimetype,
        size: s3Data.size
      });

      return res.status(201).json({ 
        data: { 
          message: 'Document uploaded successfully',
          document: newDocument
        } 
      });
    } catch (error) {
      console.error('[DocumentController.uploadDocument Error]:', error.message);
      next(error);
    }
  }
};

module.exports = DocumentController;