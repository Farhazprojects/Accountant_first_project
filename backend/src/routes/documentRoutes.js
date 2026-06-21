
const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentController');
const S3Service = require('../services/S3Service');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Route for uploading a document (requires authentication and authorization)
router.post('/client/:clientId/upload', 
  requireAuth, 
  requireRole(['admin', 'staff']),
  S3Service.uploadMiddleware, // Multer middleware to handle file upload
  DocumentController.uploadDocument
);

// TODO: Add routes for getting, updating, and deleting documents

module.exports = router;
