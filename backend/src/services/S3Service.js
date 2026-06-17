const AWS = require('aws-sdk');
const multer = require('multer');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configure Multer to store the file in memory rather than on disk
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  }
});

const S3Service = {
  uploadMiddleware: uploadMiddleware.single('document'),

  async uploadToS3(file, clientId) {
    try {
      const fileKey = `clients/${clientId}/documents/${Date.now()}-${file.originalname}`;
      
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Optional: Set ACL to private to ensure documents are secure
        ACL: 'private'
      };

      const result = await s3.upload(params).promise();
      
      return {
        url: result.Location,
        key: result.Key,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      };
    } catch (error) {
      console.error('[S3Service.uploadToS3 Error]:', error.message);
      throw error;
    }
  }
};

module.exports = S3Service;