export type CurrencyCode = "USD" | "GBP" | "EUR" | "GHS";

export interface PriceBreakdown {
  subtotal: string;
  discount: string;
  shipping: string;
  totalPaid: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface BaseEmailContext {
  brandLogoUrl: string;
  supportEmail: string;
  customerFirstName: string;
}

export interface OrderConfirmationContext extends BaseEmailContext {
  orderNumber: string;
  orderDate: string;
  viewOrderUrl: string;
  items: OrderItem[];
  pricing: PriceBreakdown;
}

export interface ShippingUpdateContext extends BaseEmailContext {
  orderNumber: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl: string;
}

export interface AbandonedCartContext extends BaseEmailContext {
  resumeCheckoutUrl: string;
  items: OrderItem[];
}

export interface RenderedEmail {
  html: string;
  text: string;
}

export interface SendEmailResult {
  id?: string;
  accepted: boolean;
  error?: string;
}
