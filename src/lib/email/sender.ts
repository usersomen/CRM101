import { supabase } from '../supabase';
import { Resend } from 'resend';
import { validateRecipient } from '../security';

// Initialize Resend only if API key is available
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendProfessionalEmail(userId: string, content: string) {
  if (!resend) {
    throw new Error('Email service is not configured. Please add VITE_RESEND_API_KEY to your environment variables.');
  }

  // Remove emojis and enforce professional tone
  const cleanContent = content
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '');

  // Validate recipient
  const recipient = extractEmailFromContent(cleanContent);
  if (!recipient) {
    throw new Error('No valid recipient found in the email content');
  }

  const isValid = await validateRecipient(userId, recipient);
  if (!isValid) {
    throw new Error('Invalid recipient');
  }

  try {
    // Send email
    await resend.emails.send({
      from: 'CRM Bot <noreply@yourdomain.com>',
      to: recipient,
      subject: extractSubject(cleanContent) || 'Professional Communication from Your CRM',
      html: applyEmailTemplate(cleanContent)
    });
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function extractEmailFromContent(content: string): string | null {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = content.match(emailRegex);
  return match ? match[0] : null;
}

function extractSubject(content: string): string | null {
  const subjectRegex = /Subject:\s*([^\n]+)/i;
  const match = content.match(subjectRegex);
  return match ? match[1].trim() : null;
}

function applyEmailTemplate(content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <header style="border-bottom: 1px solid #eee; padding-bottom: 1rem;">
        <img src="/logo.png" alt="Company Logo" style="height: 40px;">
      </header>
      
      <main style="padding: 2rem 0;">
        ${content}
      </main>

      <footer style="border-top: 1px solid #eee; padding-top: 1rem; color: #666;">
        <p>Best regards,<br>Your CRM Team</p>
      </footer>
    </div>
  `;
}