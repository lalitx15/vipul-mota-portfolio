import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export interface SendEnquiryEmailsParams {
  ownerEmail?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  enquiryType: string;
  subject: string;
  budget?: string | null;
  message: string;
  contactMethod: string;
}

export async function sendEnquiryEmails({
  ownerEmail = "connect@javigroups.com",
  senderName,
  senderEmail,
  senderPhone,
  enquiryType,
  subject,
  budget,
  message,
  contactMethod,
}: SendEnquiryEmailsParams): Promise<{ ownerSent: boolean; replySent: boolean }> {
  if (!resend) {
    console.info(
      `[Resend Email Mock] RESEND_API_KEY not configured. Simulated dispatch for enquiry from ${senderEmail}: "${subject}"`
    );
    return { ownerSent: true, replySent: true };
  }

  try {
    // 1. Email to Site Owner / Management
    const ownerEmailPromise = resend.emails.send({
      from: "Vipul Mota Portfolio <enquiries@javigroups.com>",
      to: [ownerEmail],
      subject: `[New ${enquiryType.toUpperCase()} Enquiry] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #151517; padding: 24px;">
          <h2 style="color: #0c0c0d; border-bottom: 2px solid #b8965f; padding-bottom: 12px;">New Executive Enquiry</h2>
          <p><strong>Category:</strong> ${enquiryType}</p>
          <p><strong>From:</strong> ${senderName} (<a href="mailto:${senderEmail}">${senderEmail}</a>)</p>
          ${senderPhone ? `<p><strong>Phone:</strong> ${senderPhone}</p>` : ""}
          <p><strong>Preferred Contact:</strong> ${contactMethod}</p>
          ${budget ? `<p><strong>Budget / Valuation:</strong> ${budget}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <h3 style="color: #333;">Message:</h3>
          <p style="white-space: pre-wrap; background: #f8f8f8; padding: 16px; border-left: 3px solid #b8965f;">${message}</p>
        </div>
      `,
    });

    // 2. Auto-reply to Sender
    const autoReplyPromise = resend.emails.send({
      from: "Vipul Mota <connect@javigroups.com>",
      to: [senderEmail],
      subject: `Receipt of Inquiry: ${subject} — Vipul Mota`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #151517; padding: 32px; background: #FAF8F5;">
          <h1 style="font-size: 28px; font-weight: normal; color: #0C0C0D; margin-bottom: 8px;">VIPUL MOTA</h1>
          <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #B8965F; margin-top: 0;">
            Actor &middot; Fashion Model &middot; Javi Groups
          </p>
          <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 24px 0;" />
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear ${senderName},</p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Thank you for reaching out regarding <em>"${subject}"</em>. Your inquiry has been received directly by my executive team and archived under our <strong>${enquiryType}</strong> dossier.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Whether concerning screen casting opportunities, bespoke lookbook partnerships, or private capital stewardship at Javi Groups, we treat every strategic dialogue with the utmost discretion and consideration.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            We will review your submission and connect with you via <strong>${contactMethod}</strong> shortly.
          </p>
          <div style="margin-top: 32px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 16px;">
            <p style="font-size: 14px; margin: 0; color: #111;">With warm regards,</p>
            <p style="font-size: 16px; font-style: italic; margin: 4px 0 0 0; color: #B8965F;">Vipul Mota</p>
            <p style="font-family: sans-serif; font-size: 11px; color: #888; margin-top: 4px;">Marine Drive &middot; Mumbai, India</p>
          </div>
        </div>
      `,
    });

    const [ownerRes, replyRes] = await Promise.allSettled([
      ownerEmailPromise,
      autoReplyPromise,
    ]);

    return {
      ownerSent: ownerRes.status === "fulfilled",
      replySent: replyRes.status === "fulfilled",
    };
  } catch (error) {
    console.error("Resend email dispatch error:", error);
    return { ownerSent: false, replySent: false };
  }
}

export interface SendAdminReplyParams {
  toEmail: string;
  recipientName: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
}

export async function sendAdminReplyEmail({
  toEmail,
  recipientName,
  subject,
  replyMessage,
  originalMessage,
}: SendAdminReplyParams): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.info(
      `[Resend Email Mock] RESEND_API_KEY not configured. Simulated executive reply to ${toEmail}: "${subject}"`
    );
    return { success: true };
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || "Vipul Mota <connect@javigroups.com>";
    await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      html: `
        <div style="font-family: serif; max-width: 620px; margin: 0 auto; color: #151517; padding: 32px; background: #FAF8F5; border: 1px solid #EAE5DC;">
          <h1 style="font-size: 26px; font-weight: normal; color: #0C0C0D; margin-bottom: 6px; letter-spacing: 0.05em;">VIPUL MOTA</h1>
          <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #B8965F; margin-top: 0;">
            Actor &middot; Fashion Model &middot; Javi Groups
          </p>
          <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 20px 0;" />
          <p style="font-size: 15px; color: #333; margin-bottom: 20px;">Dear ${recipientName},</p>
          <div style="font-size: 15px; line-height: 1.8; color: #222; white-space: pre-wrap; margin-bottom: 28px;">
${replyMessage}
          </div>
          ${
            originalMessage
              ? `
          <div style="margin-top: 24px; padding: 16px; background: #F2EDE4; border-left: 3px solid #B8965F; font-size: 13px; color: #666; font-family: sans-serif;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Your Original Inquiry:</p>
            <p style="margin: 0; white-space: pre-wrap;">${originalMessage}</p>
          </div>
          `
              : ""
          }
          <div style="margin-top: 32px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 16px;">
            <p style="font-size: 14px; margin: 0; color: #111;">With warm regards,</p>
            <p style="font-size: 16px; font-style: italic; margin: 4px 0 0 0; color: #B8965F;">Vipul Mota</p>
            <p style="font-family: sans-serif; font-size: 11px; color: #888; margin-top: 4px;">Marine Drive &middot; Mumbai, India</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Failed to dispatch email reply.";
    console.error("Resend admin reply dispatch error:", error);
    return { success: false, error: errMessage };
  }
}

