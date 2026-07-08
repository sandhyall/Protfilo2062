// backend/src/services/emailService.js
// Nodemailer utility — sends transactional emails for the chat system.
// Uses EMAIL_USER + EMAIL_PASS from .env.
// Dashboard link built from CLIENT_URLS env var (first URL in the list).

import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE !== 'false', // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });

// ── Dashboard URL ─────────────────────────────────────────────────────────────
// Uses the first URL from CLIENT_URLS (e.g. "http://localhost:5173,http://localhost:5174")
// Falls back to DASHBOARD_URL if set, then a hardcoded default.
// const getDashboardUrl = () => {
//   if (process.env.CLIENT_URLS) {
//     const first = process.env.CLIENT_URLS.split(',')[0].trim();
//     return `${first}/chat`;
//   }
//   if (process.env.DASHBOARD_URL) return process.env.DASHBOARD_URL;
//   return 'http://localhost:5173/chat';
// };

const getDashboardUrl = () => {
  if (process.env.CLIENT_URLS) {
    const urls = process.env.CLIENT_URLS.split(',').map(u => u.trim());

    // use SECOND URL if available, otherwise fallback to first
    const dashboard = urls[1] || urls[0];

    return `${dashboard}/chat`;
  }

  if (process.env.DASHBOARD_URL) return process.env.DASHBOARD_URL;

  return 'https://admin.asliyarecruitment.com/chat';
};

// ── Base HTML template ────────────────────────────────────────────────────────
const baseTemplate = (title, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;
                 overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#154895;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                Asliya Recruitment
              </h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">
                Live Chat Notification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} Asliya Manpower Supply &middot; Recruitment Management System
              </p>
              <p style="margin:6px 0 0;color:#9ca3af;font-size:11px;text-align:center;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── sendNewChatNotification ───────────────────────────────────────────────────
/**
 * Notify admins/recruiters that a new visitor has started a chat.
 */
export const sendNewChatNotification = async ({
  visitorName,
  visitorEmail,
  firstMessage,
  conversationId,
  recipientEmails = [],
}) => {
  if (!recipientEmails.length) {
    console.warn('⚠️  sendNewChatNotification: no recipient emails — skipping.');
    return;
  }

  const dashboardUrl = getDashboardUrl();

  const bodyHtml = `
    <div style="margin-bottom:24px;">
      <div style="display:inline-block;background:#eff6ff;color:#154895;
                  font-size:12px;font-weight:700;letter-spacing:1px;
                  text-transform:uppercase;padding:4px 12px;border-radius:100px;
                  margin-bottom:16px;">
        New Chat Started
      </div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#111827;font-weight:700;">
        A visitor needs your help
      </h2>
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
        A new chat conversation has been started. Review the details below.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;
             margin-bottom:24px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#111827;">
            ${visitorName || 'Unknown Visitor'}
          </p>
          <p style="margin:0;font-size:13px;color:#6b7280;">
            ${visitorEmail || 'No email provided'}
          </p>
        </td>
      </tr>
      ${firstMessage ? `
      <tr>
        <td style="padding:0 24px 20px;">
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#9ca3af;
                       text-transform:uppercase;letter-spacing:0.8px;">
              First Message
            </p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;font-style:italic;">
              &ldquo;${firstMessage}&rdquo;
            </p>
          </div>
        </td>
      </tr>
      ` : ''}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${dashboardUrl}"
            style="display:inline-block;background:#154895;color:#ffffff;
                   text-decoration:none;font-size:14px;font-weight:700;
                   padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
            Open Chat Dashboard
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
      The AI assistant is currently handling this conversation. You can take over at any time.
    </p>
  `;

  try {
    const transporter = createTransporter();
    // Verify connection before sending so misconfiguration surfaces clearly
    await transporter.verify();
    await transporter.sendMail({
      from: `"Asliya Chat" <${process.env.EMAIL_USER}>`,
      to: recipientEmails.join(', '),
      subject: `New chat from ${visitorName || 'a visitor'} — Asliya Recruitment`,
      html: baseTemplate('New Chat Notification', bodyHtml),
    });
    console.log(`📧 New-chat email sent to: ${recipientEmails.join(', ')}`);
  } catch (err) {
    console.error('❌ sendNewChatNotification failed:', err.message);
    // Never throw — email failure must not crash the socket handler
  }
};

// ── sendNewMessageNotification ────────────────────────────────────────────────
/**
 * Notify admins/recruiters that a visitor sent a follow-up message.
 * Only fires when the conversation is in AI mode.
 */
export const sendNewMessageNotification = async ({
  visitorName,
  visitorEmail,
  message,
  conversationId,
  recipientEmails = [],
}) => {
  if (!recipientEmails.length) {
    console.warn('⚠️  sendNewMessageNotification: no recipient emails — skipping.');
    return;
  }

  const dashboardUrl = getDashboardUrl();

  const bodyHtml = `
    <div style="margin-bottom:24px;">
      <div style="display:inline-block;background:#fef3c7;color:#92400e;
                  font-size:12px;font-weight:700;letter-spacing:1px;
                  text-transform:uppercase;padding:4px 12px;border-radius:100px;
                  margin-bottom:16px;">
        New Message
      </div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#111827;font-weight:700;">
        ${visitorName || 'A visitor'} sent a message
      </h2>
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
        ${visitorEmail || ''}
      </p>
    </div>

    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;
                padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#9ca3af;
                 text-transform:uppercase;letter-spacing:0.8px;">Message</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;font-style:italic;">
        &ldquo;${message}&rdquo;
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${dashboardUrl}"
            style="display:inline-block;background:#154895;color:#ffffff;
                   text-decoration:none;font-size:14px;font-weight:700;
                   padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
            View Conversation
          </a>
        </td>
      </tr>
    </table>
  `;

  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"Asliya Chat" <${process.env.EMAIL_USER}>`,
      to: recipientEmails.join(', '),
      subject: `New message from ${visitorName || 'visitor'} — Asliya Recruitment`,
      html: baseTemplate('New Message Notification', bodyHtml),
    });
    console.log(`📧 Message email sent to: ${recipientEmails.join(', ')}`);
  } catch (err) {
    console.error('❌ sendNewMessageNotification failed:', err.message);
  }
};