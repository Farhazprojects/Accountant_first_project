const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const isAwsConfigured = process.env.AWS_ACCESS_KEY_ID && 
                         process.env.AWS_SECRET_ACCESS_KEY && 
                         process.env.AWS_S3_BUCKET_NAME;

// Configure Multer to store the file in memory rather than on disk
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  }
});

const S3Service = {
  uploadMiddleware: uploadMiddleware.single('document'),

  /**
   * Uploads to S3 if configured, otherwise falls back to local storage
   */
  async uploadToS3(file, clientId) {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const fileKey = `clients/${clientId}/documents/${fileName}`;

      if (isAwsConfigured) {
        console.log(`[S3 Service]: Uploading ${fileKey} to S3...`);
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'private'
        };
        const result = await s3.upload(params).promise();
        return {
          url: result.Location,
          key: result.Key,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          provider: 's3'
        };
      } else {
        // LOCAL FALLBACK
        console.warn(`[S3 Service]: AWS not configured. Falling back to local storage for ${fileName}`);
        const uploadsDir = path.join(__dirname, '../../uploads', `client-${clientId}`);
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        // Return a relative URL that the app can serve
        const publicUrl = `/uploads/client-${clientId}/${fileName}`;
        
        return {
          url: publicUrl,
          key: fileKey,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          provider: 'local'
        };
      }
    } catch (error) {
      console.error('[S3Service.uploadToS3 Error]:', error.message);
      throw error;
    }
  }
};

module.exports = S3Service;
