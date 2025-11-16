import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_MAIL || 'dmprajapati98@gmail.com', // For testing
      pass: process.env.SMTP_PASSWORD || 'your_app_password_here', // You'll need to use an app password
    },
  });

  // Define mail options
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'Satya Trauma & Maternity Center'} <${process.env.SMTP_MAIL || 'dmprajapati98@gmail.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Template for appointment booking confirmation
export const getBookingEmailTemplate = (firstName, lastName, appointmentDate, department, doctorName, appointmentId, paymentStatus, transactionId) => {
  // Use a widely accessible image URL that works in emails
  const logoUrl = 'https://drive.google.com/uc?export=view&id=1xsnvPQQrdQnXCrTWo_3hzOcHMKNleO21';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="padding: 15px; text-align: center; border-radius: 5px 5px 0 0; background-color: white;">
        <!-- CSS-only logo design exactly as requested -->
        <div style="text-align: center; margin: 0 auto; width: 100%;">
          <!-- First line with S and atya -->
          <div style="margin-bottom: 0px;">
            <span style="color: #0053a2; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">S</span>
            <span style="display: inline-block; width: 40px;"></span>
            <span style="color: #b3e000; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">atya</span>
          </div>
          
          <!-- Trauma & Maternity Center text centered -->
          <div style="text-align: center; margin-top: 0px;">
            <span style="color: #000000; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">Trauma & Maternity Center</span>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h3>Dear ${firstName} ${lastName},</h3>
        <p>Thank you for booking an appointment with us. Your appointment details are as follows:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #b3e000; margin: 20px 0;">
          <p><strong>Appointment #:</strong> <span style="color: #0053a2; font-weight: bold;">${appointmentId}</span></p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Status:</strong> <span style="color: #f1c40f; font-weight: bold;">Pending Approval</span></p>
          ${paymentStatus === "PAID" ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
            <p><strong>Payment Status:</strong> <span style="color: #2ecc71; font-weight: bold;">PAID</span></p>
            <p><strong>Amount:</strong> ₹500.00</p>
            <p><strong>Transaction ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${transactionId}</span></p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ` : ''}
        </div>
        
        <p>Your appointment is currently pending approval from our administrative staff. You will receive another email once your appointment is approved.</p>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>Satya Trauma & Maternity Center Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
        <p style="margin: 0; color: #666;">© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Template for appointment approval notification
export const getApprovalEmailTemplate = (firstName, lastName, appointmentDate, department, doctorName, appointmentId, paymentStatus, transactionId) => {
  // Use a widely accessible image URL that works in emails
  const logoUrl = 'https://drive.google.com/uc?export=view&id=1xsnvPQQrdQnXCrTWo_3hzOcHMKNleO21';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="padding: 15px; text-align: center; border-radius: 5px 5px 0 0; background-color: white;">
        <!-- CSS-only logo design exactly as requested -->
        <div style="text-align: center; margin: 0 auto; width: 100%;">
          <!-- First line with S and atya -->
          <div style="margin-bottom: 0px;">
            <span style="color: #0053a2; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">S</span>
            <span style="display: inline-block; width: 40px;"></span>
            <span style="color: #b3e000; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">atya</span>
          </div>
          
          <!-- Trauma & Maternity Center text centered -->
          <div style="text-align: center; margin-top: 0px;">
            <span style="color: #000000; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">Trauma & Maternity Center</span>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h3>Dear ${firstName} ${lastName},</h3>
        <p>Great news! Your appointment at Satya Trauma & Maternity Center has been <strong style="color: #2ecc71;">APPROVED</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2ecc71; margin: 20px 0;">
          <p><strong>Appointment #:</strong> <span style="color: #0053a2; font-weight: bold;">${appointmentId}</span></p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Status:</strong> <span style="color: #2ecc71; font-weight: bold;">Approved</span></p>
          ${paymentStatus === "PAID" ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
            <p><strong>Payment Status:</strong> <span style="color: #2ecc71; font-weight: bold;">PAID</span></p>
            <p><strong>Amount:</strong> ₹500.00</p>
            <p><strong>Transaction ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${transactionId}</span></p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ` : ''}
        </div>
        
        <p>Please arrive 15 minutes before your scheduled appointment time. Don't forget to bring your identification and any relevant medical records.</p>
        
        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        
        <p>We look forward to seeing you!</p>
        
        <p>Best regards,<br>Satya Trauma & Maternity Center Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
        <p style="margin: 0; color: #666;">© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Template for appointment rejection notification
export const getRejectionEmailTemplate = (firstName, lastName, appointmentDate, department, doctorName, appointmentId, paymentStatus, transactionId) => {
  // Use a widely accessible image URL that works in emails
  const logoUrl = 'https://drive.google.com/uc?export=view&id=1xsnvPQQrdQnXCrTWo_3hzOcHMKNleO21';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="padding: 15px; text-align: center; border-radius: 5px 5px 0 0; background-color: white;">
        <!-- CSS-only logo design exactly as requested -->
        <div style="text-align: center; margin: 0 auto; width: 100%;">
          <!-- First line with S and atya -->
          <div style="margin-bottom: 0px;">
            <span style="color: #0053a2; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">S</span>
            <span style="display: inline-block; width: 40px;"></span>
            <span style="color: #b3e000; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">atya</span>
          </div>
          
          <!-- Trauma & Maternity Center text centered -->
          <div style="text-align: center; margin-top: 0px;">
            <span style="color: #000000; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">Trauma & Maternity Center</span>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h3>Dear ${firstName} ${lastName},</h3>
        <p>We regret to inform you that your appointment request could not be accommodated at this time.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
          <p><strong>Appointment #:</strong> <span style="color: #0053a2; font-weight: bold;">${appointmentId}</span></p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Doctor:</strong>${doctorName}</p>
          <p><strong>Status:</strong> <span style="color: #e74c3c; font-weight: bold;">Not Approved</span></p>
          ${paymentStatus === "PAID" ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
            <p><strong>Payment Status:</strong> <span style="color: #2ecc71; font-weight: bold;">PAID</span></p>
            <p><strong>Amount:</strong> ₹500.00</p>
            <p><strong>Transaction ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${transactionId}</span></p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Note:</strong> <span style="color: #e67e22;">Your payment will be refunded within 7-10 business days.</span></p>
          </div>
          ` : ''}
        </div>
        
        <p>This could be due to one of the following reasons:</p>
        <ul>
          <li>The doctor is unavailable at the requested time</li>
          <li>Schedule conflicts with existing appointments</li>
          <li>Specialized care requirements</li>
        </ul>
        
        <p>We encourage you to book a new appointment at a different date or time.</p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Best regards,<br>Satya Trauma & Maternity Center Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
        <p style="margin: 0; color: #666;">© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Template for direct appointment booking (no login required)
export const getDirectBookingEmailTemplate = (firstName, lastName, appointmentDate, department, doctorName, appointmentId, paymentStatus, transactionId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="padding: 15px; text-align: center; border-radius: 5px 5px 0 0; background-color: white;">
        <!-- CSS-only logo design exactly as requested -->
        <div style="text-align: center; margin: 0 auto; width: 100%;">
          <!-- First line with S and atya -->
          <div style="margin-bottom: 0px;">
            <span style="color: #0053a2; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">S</span>
            <span style="display: inline-block; width: 40px;"></span>
            <span style="color: #b3e000; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">atya</span>
          </div>
          
          <!-- Trauma & Maternity Center text centered -->
          <div style="text-align: center; margin-top: 0px;">
            <span style="color: #000000; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">Trauma & Maternity Center</span>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h3>Dear ${firstName} ${lastName},</h3>
        <p>Thank you for requesting an appointment with us. Your appointment request has been received and is being processed.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3939d9; margin: 20px 0;">
          <p><strong>Appointment #:</strong> <span style="color: #0053a2; font-weight: bold;">${appointmentId}</span></p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Status:</strong> <span style="color: #f1c40f; font-weight: bold;">Pending Approval</span></p>
          ${paymentStatus === "PAID" ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
            <p><strong>Payment Status:</strong> <span style="color: #2ecc71; font-weight: bold;">PAID</span></p>
            <p><strong>Amount:</strong> ₹500.00</p>
            <p><strong>Transaction ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${transactionId}</span></p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ` : ''}
        </div>
        
        <p>Our staff will review your request and contact you shortly to confirm your appointment. Please note that this is not a confirmed appointment yet.</p>
        
        <p>For faster booking and to manage your appointments online, consider creating an account on our website.</p>
        
        <p>If you have any questions or need immediate assistance, please contact us at:</p>
        <ul>
          <li>Phone: +91-9838951052</li>
          <li>Email: stmckanpur@gmail.com</li>
        </ul>
        
        <p>Best regards,<br>Satya Trauma & Maternity Center Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
        <p style="margin: 0; color: #666;">© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Template for payment confirmation
export const getPaymentConfirmationEmailTemplate = (firstName, lastName, appointmentId, amount, transactionId, appointmentDate, department, doctorName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="padding: 15px; text-align: center; border-radius: 5px 5px 0 0; background-color: white;">
        <!-- CSS-only logo design -->
        <div style="text-align: center; margin: 0 auto; width: 100%;">
          <!-- First line with S and atya -->
          <div style="margin-bottom: 0px;">
            <span style="color: #0053a2; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">S</span>
            <span style="display: inline-block; width: 40px;"></span>
            <span style="color: #b3e000; font-size: 60px; font-weight: bold; font-family: Arial, sans-serif;">atya</span>
          </div>
          
          <!-- Trauma & Maternity Center text centered -->
          <div style="text-align: center; margin-top: 0px;">
            <span style="color: #000000; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">Trauma & Maternity Center</span>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #2ecc71; text-align: center;">Payment Successful!</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #2ecc71; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Transaction ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 5px; border-radius: 3px;">${transactionId}</span></p>
          <p><strong>Amount Paid:</strong> <span style="color: #2ecc71; font-weight: bold;">₹${amount}.00</span></p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> UPI</p>
          <p><strong>Status:</strong> <span style="color: #2ecc71; font-weight: bold;">SUCCESSFUL</span></p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #3498db; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details</h3>
          <p><strong>Appointment #:</strong> <span style="color: #0053a2; font-weight: bold;">${appointmentId}</span></p>
          <p><strong>Patient Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Status:</strong> <span style="color: #f1c40f; font-weight: bold;">Pending Approval</span></p>
        </div>
        
        <p>Dear ${firstName},</p>
        <p>Thank you for your payment. This email confirms that we have successfully received your payment for the appointment booking at Satya Trauma & Maternity Center.</p>
        <p>Your appointment is currently pending approval from our administrative staff. You will receive another email once your appointment is approved.</p>
        
        <p>Please save this email for your records. If you have any questions about your payment or appointment, please contact our support team.</p>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4f8; border-radius: 5px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Need assistance?</p>
          <p style="margin: 5px 0 0;">Call us at: +91-9838951052 or email at: stmckanpur@gmail.com</p>
        </div>
        
        <p>Best regards,<br>Satya Trauma & Maternity Center Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
        <p style="margin: 0; color: #666;">© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
      </div>
    </div>
  `;
};