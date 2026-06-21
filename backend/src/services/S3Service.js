const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure AWS S3 (v3)
const awsRegion = process.env.AWS_REGION || 'us-east-1';
const s3Client = new S3Client({
  region: awsRegion,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

const isAwsConfigured = process.env.AWS_ACCESS_KEY_ID && 
                         process.env.AWS_SECRET_ACCESS_KEY && 
                         process.env.AWS_S3_BUCKET_NAME;

// Configure Multer to store the file in memory rather than on disk
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
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
        console.log(`[S3 Service]: Uploading ${fileKey} to S3 (v3)...`);
        const bucket = process.env.AWS_S3_BUCKET_NAME;
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'private'
        });

        await s3Client.send(command);

        // Construct a reasonable object URL (may vary by setup/config)
        let url;
        if (awsRegion === 'us-east-1') {
          url = `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(fileKey)}`;
        } else {
          url = `https://${bucket}.s3.${awsRegion}.amazonaws.com/${encodeURIComponent(fileKey)}`;
        }

        return {
          url,
          key: fileKey,
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
