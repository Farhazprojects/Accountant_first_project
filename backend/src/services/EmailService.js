const sgMail = require('@sendgrid/mail');

// Initialize with your SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@accountantfirst.com';
const APP_URL = process.env.REACT_APP_URL || 'http://localhost:3000';

const EmailService = {
  /**
   * Universal sender wrapper with built-in logging
   */
  async sendEmail({ to, subject, html }) {
    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      html,
    };

    try {
      if (process.env.NODE_ENV === 'test') {
        console.log(`[Mock Email Sent]: To: ${to} | Subject: ${subject}`);
        return true;
      }
      
      await sgMail.send(msg);
      console.log(`[Email Service]: Email successfully dispatched to ${to}`);
      return true;
    } catch (error) {
      console.error('[EmailService.sendEmail Error]:', error.message);
      if (error.response) {
        console.error(error.response.body);
      }
      // Don't crash the server if an email fails, just return false
      return false;
    }
  },

  /**
   * Trigger 1: Sent to the client when a proposal is ready for review
   */
  async sendProposalToClient(clientEmail, clientName, proposalId, amount) {
    const reviewUrl = `${APP_URL}/proposal/${proposalId}`;
    
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Hello ${clientName},</h2>
        <p>Your custom financial services proposal is ready for review.</p>
        <p><strong>Investment details:</strong> $${amount} / month</p>
        <p>Please click the button below to view the scope of work and legally sign the document online.</p>
        <br/>
        <a href="${reviewUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Review & Sign Proposal
        </a>
        <br/><br/>
        <p>Best regards,<br/>Your Accounting Team</p>
      </div>
    `;

    return this.sendEmail({
      to: clientEmail,
      subject: 'Action Required: Your Service Proposal is Ready',
      html: htmlContent
    });
  },

  /**
   * Trigger 2: Sent to the firm admin when a client signs the proposal
   */
  async notifyAdminProposalSigned(adminEmail, clientName, documentUrl) {
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Great News!</h2>
        <p><strong>${clientName}</strong> has just accepted and digitally signed their onboarding proposal.</p>
        <p>The system has automatically updated their profile status and generated a signed copy.</p>
        <br/>
        <a href="${documentUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          View Signed PDF on S3
        </a>
        <br/><br/>
        <p>Accountant First Automation Engine</p>
      </div>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `🎉 Onboarding Complete: ${clientName} Signed!`,
      html: htmlContent
    });
  },

  /**
   * Trigger 3: Sent to a staff member when a workflow task is assigned to them
   */
  async notifyStaffTaskAssigned(staffEmail, staffName, taskTitle, workflowName, dueDate) {
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Hello ${staffName},</h2>
        <p>A new priority item has been assigned to you in the system workspace.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #0f172a; margin: 16px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Task:</strong> ${taskTitle}</p>
          <p style="margin: 0 0 8px 0;"><strong>Workflow:</strong> ${workflowName}</p>
          <p style="margin: 0;"><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Log in to your dashboard to begin execution.</p>
        <br/>
        <a href="${APP_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Go to My Dashboard
        </a>
      </div>
    `;

    return this.sendEmail({
      to: staffEmail,
      subject: `🎯 New Task Assigned: ${taskTitle}`,
      html: htmlContent
    });
  }
};

module.exports = EmailService;