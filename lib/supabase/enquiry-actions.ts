"use server";

import { headers } from "next/headers";
import { createServerClient } from "./server";
import { enquirySchema, type EnquiryInput } from "@/lib/validators/enquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEnquiryEmails } from "@/lib/email";

export interface EnquiryActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function submitEnquiryAction(
  data: EnquiryInput
): Promise<EnquiryActionResult> {
  try {
    // 1. Rate Limiting Check
    const headersList = headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous-client";
    const rateLimitKey = `enquiry-${clientIp}-${data.email}`;

    const rateLimit = checkRateLimit(rateLimitKey, { limit: 4, windowSeconds: 600 });
    if (!rateLimit.success) {
      return {
        error: `Submission limit reached. Please wait ${Math.ceil(
          rateLimit.resetInSeconds / 60
        )} minutes before submitting another inquiry.`,
      };
    }

    // 2. Honeypot Bot Trap Check
    if (data.fax_hp_field && data.fax_hp_field.length > 0) {
      // Silently accept bot submission without persisting
      return {
        success: true,
        message: "Your inquiry has been logged.",
      };
    }

    // 3. Zod Validation
    const validation = enquirySchema.safeParse(data);
    if (!validation.success) {
      return {
        error: validation.error.errors[0]?.message || "Invalid inquiry details provided.",
      };
    }

    const validData = validation.data;
    const supabase = createServerClient();

    // 4. Authenticated User Association (if signed in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 5. Insert into Supabase `enquiries` table
    const { error: insertError } = await (supabase.from("enquiries") as any).insert({
      type: validData.type,
      name: validData.name,
      email: validData.email,
      phone: validData.phone || null,
      subject: validData.subject,
      budget: validData.budget || null,
      message: validData.message,
      contact_method: validData.contact_method,
      status: "new",
      user_id: user?.id || null,
    });

    if (insertError) {
      return { error: insertError.message };
    }

    // 6. Dispatch Executive & Auto-reply Emails via Resend
    await sendEnquiryEmails({
      senderName: validData.name,
      senderEmail: validData.email,
      senderPhone: validData.phone,
      enquiryType: validData.type,
      subject: validData.subject,
      budget: validData.budget,
      message: validData.message,
      contactMethod: validData.contact_method,
    });

    return {
      success: true,
      message:
        "Your inquiry has been received directly by Vipul Mota's management office. A formal confirmation dispatch has been sent to your email.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process inquiry.";
    return { error: message };
  }
}
