import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  whatsapp: z.string()
    .min(1, "WhatsApp number is required")
    .regex(/^(0)?[789][01]\d{8}$/, "Please enter a valid Nigerian number (e.g. 8031234567 or 08031234567)"),
  track: z.enum(["professional", "parent", "other"])
});

export type RegisterInput = z.infer<typeof registerSchema>;