"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { submitEnquiryAction } from "@/lib/supabase/enquiry-actions";
import type { EnquiryInput } from "@/lib/validators/enquiry";

type InquiryType = "general" | "brand" | "booking";

interface ContactFormProps {
  initialType?: InquiryType;
}

export function ContactForm({ initialType = "general" }: ContactFormProps) {
  const { success, error } = useToast();

  const [activeType, setActiveType] = useState<InquiryType>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<EnquiryInput>({
    type: initialType,
    name: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    message: "",
    contact_method: "email",
    fax_hp_field: "",
  });

  const handleTabChange = (type: InquiryType) => {
    setActiveType(type);
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await submitEnquiryAction(formData);
    setIsSubmitting(false);

    if (res.error) {
      error(res.error, "Inquiry Notice");
    } else {
      setIsSubmitted(true);
      success(
        res.message || "Your inquiry has been successfully transmitted.",
        "Transmitted"
      );
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      type: activeType,
      name: "",
      email: "",
      phone: "",
      subject: "",
      budget: "",
      message: "",
      contact_method: "email",
      fax_hp_field: "",
    });
  };

  const tabLabels = [
    { id: "general" as const, label: "General Inquiries" },
    { id: "brand" as const, label: "Brand Alliances & Modeling" },
    { id: "booking" as const, label: "Media & Casting Booking" },
  ];

  return (
    <div className="bg-charcoal border border-line p-6 sm:p-10 lg:p-12 space-y-8">
      {/* Three Inquiry Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        {tabLabels.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`py-2.5 px-4 text-xs uppercase tracking-[0.16em] transition-all rounded-none ${
                isActive
                  ? "bg-gold text-ink font-semibold"
                  : "bg-ink text-stone hover:text-ivory hover:bg-ink/80 border border-line"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <m.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="py-16 text-center space-y-6 max-w-md mx-auto"
          >
            {/* Animated SVG Check using pathLength per animation guidelines */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 border border-gold flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <m.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="editorial-label text-gold">Transmission Complete</span>
              <h3 className="font-serif text-3xl text-ivory font-light">
                Inquiry Logged to Archive
              </h3>
              <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
                Your dossier has been routed to Vipul Mota&rsquo;s executive desk. A formal receipt dispatch has been dispatched to your email.
              </p>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Submit Another Inquiry
              </Button>
            </div>
          </m.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden Bot Honeypot */}
            <input
              type="text"
              name="fax_hp_field"
              value={formData.fax_hp_field}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  Full Name / Legal Designation <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Anand Mahindra"
                  required
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@organization.com"
                  required
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Phone & Preferred Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="+91 98200 00000"
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  Preferred Contact Method <span className="text-gold">*</span>
                </label>
                <select
                  name="contact_method"
                  value={formData.contact_method}
                  onChange={handleChange}
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="email">Direct Email</option>
                  <option value="phone">Telephone Call</option>
                  <option value="whatsapp">WhatsApp Executive Protocol</option>
                </select>
              </div>
            </div>

            {/* Row 3: Subject & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  Subject / Project Title <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={
                    activeType === "booking"
                      ? "Screen Casting Role or Keynote Inquiry"
                      : activeType === "brand"
                      ? "Editorial Lookbook or Brand Endorsement"
                      : "Strategic Dialogue or Consultation"
                  }
                  required
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="editorial-label text-stone block text-xs">
                  {activeType === "brand" || activeType === "booking"
                    ? "Budget Allocation (Optional)"
                    : "Syndication Scale / Valuation (Optional)"}
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget || ""}
                  onChange={handleChange}
                  placeholder="e.g. ₹10L - ₹25L or Confidential"
                  className="w-full bg-ink border border-line p-3.5 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label className="editorial-label text-stone block text-xs">
                Inquiry Brief &amp; Detailed Scope <span className="text-gold">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Outline narrative themes, production schedules, corporate objectives, or specific dates..."
                required
                className="w-full bg-ink border border-line p-4 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-stone font-light">
                Submissions are governed by private confidentiality protocols.
              </span>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Transmitting..." : "Submit Inquiry to Office &rarr;"}
              </Button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
