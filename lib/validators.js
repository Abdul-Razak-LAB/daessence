import { z } from "zod";

export const emailSchema = z.string().email();

export const cartCreateSchema = z.object({
  email: z.string().email().optional(),
});

export const addCartItemSchema = z.object({
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
});

export const patchCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(20),
});

export const applyCouponSchema = z.object({
  cartId: z.string().uuid(),
  code: z.string().trim().min(2).max(32),
});

export const checkoutSchema = z.object({
  cartId: z.string().uuid(),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(2),
    stateRegion: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().length(2),
  }),
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: z
    .object({
      line1: z.string().min(2),
      line2: z.string().optional(),
      city: z.string().min(2),
      stateRegion: z.string().optional(),
      postalCode: z.string().optional(),
      countryCode: z.string().length(2),
    })
    .optional(),
  payment: z.object({
    provider: z.enum(["mobile_money", "visa_card"]),
    paymentMethodId: z.enum(["mobile-money", "visa-card"]),
  }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(2000),
});

export const adminStatusSchema = z.object({
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled", "refunded"]),
  trackingNumber: z.string().optional(),
  carrierName: z.string().optional(),
});
