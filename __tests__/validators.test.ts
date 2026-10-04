import { describe, it, expect } from "vitest";
import { enquirySchema } from "../lib/validators/enquiry";
import { checkRateLimit } from "../lib/rate-limit";
import { cn } from "../lib/utils";

describe("Executive Inquiry Validation Suite (Zod)", () => {
  it("should validate a complete, high-value representation inquiry", () => {
    const validData = {
      name: "Rohit Varma",
      email: "rohit.varma@production.in",
      phone: "+91 98200 12345",
      type: "booking",
      subject: "Lead Character Casting Inquiry: Episodic Drama Series",
      budget: "INR 25,00,000+",
      message:
        "We are casting an intense South Mumbai thriller and would like to review Mr. Mota for an executive antagonist role.",
      contact_method: "phone",
      fax_hp_field: "",
    };

    const result = enquirySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject submissions with invalid email addresses", () => {
    const invalidData = {
      name: "Inquiry Sender",
      email: "not-an-email",
      type: "general",
      subject: "General Question",
      message: "This is a test message to evaluate email format error rejection.",
      contact_method: "email",
    };

    const result = enquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("valid email");
    }
  });

  it("should reject automated bot submissions that populate the honeypot field", () => {
    const botData = {
      name: "Spam Bot",
      email: "bot@spammer.com",
      type: "brand",
      subject: "Crypto Investment Promotion",
      message: "Spam message payload with unwanted automated offers.",
      contact_method: "email",
      fax_hp_field: "http://spam-link.ru", // Honeypot filled
    };

    const result = enquirySchema.safeParse(botData);
    expect(result.success).toBe(false);
  });

  it("should reject message bodies shorter than 10 characters", () => {
    const shortData = {
      name: "Brief Sender",
      email: "sender@example.com",
      type: "general",
      subject: "Quick Hello",
      message: "Hi there",
      contact_method: "email",
    };

    const result = enquirySchema.safeParse(shortData);
    expect(result.success).toBe(false);
  });
});

describe("Rate Limiting Engine", () => {
  it("should allow submissions within the defined window limit", () => {
    const key = `test-client-${Date.now()}`;
    const firstCheck = checkRateLimit(key, { limit: 3, windowSeconds: 60 });
    expect(firstCheck.success).toBe(true);
    expect(firstCheck.remaining).toBe(2);
  });

  it("should block requests when rate limit threshold is exceeded", () => {
    const key = `rate-limit-blocked-${Date.now()}`;
    checkRateLimit(key, { limit: 2, windowSeconds: 60 });
    checkRateLimit(key, { limit: 2, windowSeconds: 60 });
    const thirdAttempt = checkRateLimit(key, { limit: 2, windowSeconds: 60 });

    expect(thirdAttempt.success).toBe(false);
    expect(thirdAttempt.remaining).toBe(0);
    expect(thirdAttempt.resetInSeconds).toBeGreaterThan(0);
  });
});

describe("Design System CSS Utility (cn)", () => {
  it("should merge conditional class names accurately", () => {
    const result = cn(
      "font-serif text-ivory",
      true && "tracking-wide",
      false && "hidden",
      "p-4"
    );
    expect(result).toBe("font-serif text-ivory tracking-wide p-4");
  });

  it("should resolve conflicting tailwind padding classes", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");
  });
});
