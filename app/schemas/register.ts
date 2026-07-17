import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  countryCode: z.string().optional(),
  whatsapp: z.string()
    .min(1, "WhatsApp number is required")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number (e.g. +234 803 123 4567)"),
  track: z.enum(["professional", "parent", "other"])
});

export type RegisterInput = z.infer<typeof registerSchema>;