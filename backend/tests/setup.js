// Mock AWS S3 Uploads (AWS SDK v3)
jest.mock('@aws-sdk/client-s3', () => {
  const mockSend = jest.fn().mockResolvedValue({
    // PutObjectCommand doesn't normally return Location/Key, but tests expect them
    Location: 'https://accountantfirst-test-bucket.s3.amazonaws.com/mock-proposal.pdf',
    Key: 'clients/test-id/documents/mock-proposal.pdf'
  });
  const S3Client = jest.fn().mockImplementation(() => ({ send: mockSend }));
  const PutObjectCommand = jest.fn();
  return { S3Client, PutObjectCommand };
});

// Mock SendGrid Transactional Emails
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }])
}));

// Mock Xero Accounting Core API
jest.mock('xero-node', () => ({
  XeroClient: jest.fn().mockImplementation(() => ({
    accountingApi: {
      createContacts: jest.fn().mockResolvedValue({
        body: {
          contacts: [{ contactID: 'xero-contact-mock-12345' }]
        }
      })
    }
  }))
}));