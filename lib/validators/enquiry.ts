import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters."),
  email: z.string().email("Please provide a valid email address."),
  phone: z
    .string()
    .max(25, "Phone number cannot exceed 25 characters.")
    .optional()
    .or(z.literal("")),
  type: z.enum(["general", "brand", "booking"], {
    errorMap: () => ({ message: "Please select a valid inquiry type." }),
  }),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters.")
    .max(120, "Subject cannot exceed 120 characters."),
  budget: z.string().max(50).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message cannot exceed 2,000 characters."),
  contact_method: z.enum(["email", "phone", "whatsapp"], {
    errorMap: () => ({ message: "Please select a preferred contact method." }),
  }),
  // Honeypot field (must remain empty)
  fax_hp_field: z.string().max(0, "Automated submission rejected.").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
