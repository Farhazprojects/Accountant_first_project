// Mock AWS S3 Uploads
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      upload: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Location: 'https://accountantfirst-test-bucket.s3.amazonaws.com/mock-proposal.pdf',
          Key: 'clients/test-id/documents/mock-proposal.pdf'
        })
      })
    }))
  };
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