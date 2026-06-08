import { z } from "zod";
import { COUNTRIES, ORDER_STATUSES } from "@/lib/constants";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  country: z.enum(COUNTRIES),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const orderSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10),
  referenceUrl: z.string().url().optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1).default(1),
  deliveryCountry: z.string().min(1),
  deliveryCity: z.string().min(1),
  deliveryAddress: z.string().min(5),
  specialInstructions: z.string().optional(),
  attachments: z.array(z.object({ fileUrl: z.string().url(), fileType: z.enum(["reference_image", "proof_of_payment", "document"]) })).optional(),
});

export const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  adminNotes: z.string().optional(),
});

export const quoteSchema = z.object({
  orderId: z.string().uuid(),
  price: z.coerce.number().positive(),
  currency: z.enum(["USD", "ZAR"]),
  notes: z.string().optional(),
});
