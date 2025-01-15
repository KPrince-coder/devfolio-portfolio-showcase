// import nodemailer from 'nodemailer';
// import { ContactSubmission } from '@/types/messages';

// // Email transporter configuration remains the same

// interface ReplyEmailParams {
//   to: string;
//   subject: string;
//   replyText: string;
//   originalMessage: ContactSubmission;
// }

// export const sendReplyEmail = async (params: ReplyEmailParams) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: params.to,
//       subject: params.subject,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Reply to Your Message</h2>
          
//           <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
//             <h3>Original Message</h3>
//             <p><strong>From:</strong> ${params.originalMessage.full_name}</p>
//             <p><strong>Subject:</strong> ${params.originalMessage.subject}</p>
//             <p>${params.originalMessage.message}</p>
//           </div>
          
//           <div style="background-color: #e6f3ff; padding: 15px; border-radius: 5px;">
//             <h3>Our Response</h3>
//             <p>${params.replyText}</p>
//           </div>
          
//           <p style="margin-top: 20px; font-size: 12px; color: #666;">
//             This is an automated response. Please do not reply to this email.
//           </p>
//         </div>
//       `
//     });
//   } catch (error) {
//     console.error('Failed to send reply email:', error);
//     throw error;
//   }
// };


import nodemailer from 'nodemailer';
import { ContactSubmission } from '@/types/messages';


// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface NotificationEmailParams {
  submissionId: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendAdminNotificationEmail = async (params: NotificationEmailParams) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${params.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Submission ID:</strong> ${params.submissionId}</p>
        <p><strong>Name:</strong> ${params.full_name}</p>
        <p><strong>Email:</strong> ${params.email}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
        <p><strong>Message:</strong> ${params.message}</p>
        <p>Please log in to your admin dashboard to view and respond to this message.</p>

        
      `
    });
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
  }
};



interface ReplyEmailParams {
  to: string;
  subject: string;
  replyText: string;
  originalMessage: ContactSubmission;
}

export const sendReplyEmail = async (params: ReplyEmailParams) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reply to Your Message</h2>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3>Original Message</h3>
            <p><strong>From:</strong> ${params.originalMessage.full_name}</p>
            <p><strong>Subject:</strong> ${params.originalMessage.subject}</p>
            <p>${params.originalMessage.message}</p>
          </div>
          
          <div style="background-color: #e6f3ff; padding: 15px; border-radius: 5px;">
            <h3>Our Response</h3>
            <p>${params.replyText}</p>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send reply email:', error);
    throw error;
  }
};