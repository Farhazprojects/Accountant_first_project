// Puppeteer is lazy-required inside functions to avoid loading it at module import time
// (prevents ESM/CommonJS conflicts during startup)
const { PDFDocument } = require('pdf-lib');

const PdfService = {
  /**
   * Generates a PDF from an HTML string using Puppeteer
   */
  async generatePdfFromHtml(htmlContent) {
    const puppeteer = require('puppeteer');
    let browser;
    try {
      let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      if (!executablePath) {
        if (process.platform === 'darwin') {
          executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        } else if (process.platform === 'linux') {
          executablePath = '/usr/bin/chromium-browser';
        }
      }

      // Launch headless browser with container-optimized settings
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'load' });
      
      // Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });

      return pdfBuffer;
    } catch (error) {
      console.error('[PdfService.generatePdfFromHtml Error]:', error.message);
      throw error;
    } finally {
      if (browser) await browser.close();
    }
  },

  /**
   * Stamps a Base64 PNG signature onto the last page of an existing PDF buffer
   */
  async stampSignatureOnPdf(pdfBuffer, base64Signature) {
    try {
      // Load the PDF into pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      
      // Clean the base64 string (remove the data:image/png;base64, prefix if present)
      const base64Data = base64Signature.replace(/^data:image\/png;base64,/, "");
      
      // Embed the PNG signature
      const signatureImage = await pdfDoc.embedPng(base64Data);
      
      // Get the last page of the document
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      
      // Define stamp dimensions and placement (bottom left corner)
      const { width, height } = lastPage.getSize();
      const sigWidth = 150;
      const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;
      
      lastPage.drawImage(signatureImage, {
        x: 50,
        y: 50, // 50 units from the bottom
        width: sigWidth,
        height: sigHeight,
      });
      
      // Serialize the PDFDocument to bytes (a Uint8Array)
      const stampedPdfBytes = await pdfDoc.save();
      
      // Convert back to Node Buffer for S3 upload
      return Buffer.from(stampedPdfBytes);
    } catch (error) {
      console.error('[PdfService.stampSignatureOnPdf Error]:', error.message);
      throw error;
    }
  }
};

module.exports = PdfService;
