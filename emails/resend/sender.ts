import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resend } from "resend";
import type {
  AbandonedCartContext,
  OrderConfirmationContext,
  RenderedEmail,
  SendEmailResult,
  ShippingUpdateContext,
} from "./types";

const templatesDir = join(__dirname, "templates");

function loadTemplate(name: string): RenderedEmail {
  const html = readFileSync(join(templatesDir, `${name}.html`), "utf8");
  const text = readFileSync(join(templatesDir, `${name}.txt`), "utf8");
  return { html, text };
}

function replaceToken(input: string, token: string, value: string): string {
  return input.replaceAll(`{{${token}}}`, value);
}

function renderOrderItemsHtml(items: Array<{ name: string; quantity: number; unitPrice: string; lineTotal: string }>): string {
  return items
    .map(
      (item) =>
        `<p style=\"margin:0 0 4px;\">${item.name} x${item.quantity} (${item.unitPrice}) - <strong>${item.lineTotal}</strong></p>`
    )
    .join("\n");
}

function renderOrderItemsText(items: Array<{ name: string; quantity: number; unitPrice: string; lineTotal: string }>): string {
  return items.map((item) => `- ${item.name} x${item.quantity} (${item.unitPrice}) = ${item.lineTotal}`).join("\n");
}

function renderOrderConfirmation(ctx: OrderConfirmationContext): RenderedEmail {
  const base = loadTemplate("order-confirmation");
  let html = base.html;
  let text = base.text;

  const values: Record<string, string> = {
    brandLogoUrl: ctx.brandLogoUrl,
    supportEmail: ctx.supportEmail,
    customerFirstName: ctx.customerFirstName || "Customer",
    orderNumber: ctx.orderNumber,
    orderDate: ctx.orderDate,
    viewOrderUrl: ctx.viewOrderUrl,
    subtotal: ctx.pricing.subtotal,
    discount: ctx.pricing.discount,
    shipping: ctx.pricing.shipping,
    totalPaid: ctx.pricing.totalPaid,
    orderItemsHtml: renderOrderItemsHtml(ctx.items),
    orderItemsText: renderOrderItemsText(ctx.items),
  };

  for (const [token, value] of Object.entries(values)) {
    html = replaceToken(html, token, value);
    text = replaceToken(text, token, value);
  }

  return { html, text };
}

function renderShippingUpdate(ctx: ShippingUpdateContext): RenderedEmail {
  const base = loadTemplate("shipping-update");
  let html = base.html;
  let text = base.text;

  const values: Record<string, string> = {
    brandLogoUrl: ctx.brandLogoUrl,
    supportEmail: ctx.supportEmail,
    customerFirstName: ctx.customerFirstName || "Customer",
    orderNumber: ctx.orderNumber,
    carrierName: ctx.carrierName,
    trackingNumber: ctx.trackingNumber,
    trackingUrl: ctx.trackingUrl,
  };

  for (const [token, value] of Object.entries(values)) {
    html = replaceToken(html, token, value);
    text = replaceToken(text, token, value);
  }

  return { html, text };
}

function renderAbandonedCart(ctx: AbandonedCartContext): RenderedEmail {
  const base = loadTemplate("abandoned-cart");
  let html = base.html;
  let text = base.text;

  const values: Record<string, string> = {
    brandLogoUrl: ctx.brandLogoUrl,
    supportEmail: ctx.supportEmail,
    customerFirstName: ctx.customerFirstName || "Customer",
    resumeCheckoutUrl: ctx.resumeCheckoutUrl,
    cartItemsHtml: renderOrderItemsHtml(ctx.items),
    cartItemsText: renderOrderItemsText(ctx.items),
  };

  for (const [token, value] of Object.entries(values)) {
    html = replaceToken(html, token, value);
    text = replaceToken(text, token, value);
  }

  return { html, text };
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }
  return new Resend(apiKey);
}

async function sendEmail(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  tags?: Array<{ name: string; value: string }>;
}): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      tags: params.tags,
    });

    if (response.error) {
      return { accepted: false, error: response.error.message };
    }

    return { accepted: true, id: response.data?.id };
  } catch (error) {
    return {
      accepted: false,
      error: error instanceof Error ? error.message : "Unknown Resend error",
    };
  }
}

export async function sendOrderConfirmationEmail(input: {
  to: string;
  from: string;
  subject?: string;
  context: OrderConfirmationContext;
}): Promise<SendEmailResult> {
  const rendered = renderOrderConfirmation(input.context);
  return sendEmail({
    to: input.to,
    from: input.from,
    subject: input.subject ?? `Order Confirmed: ${input.context.orderNumber}`,
    html: rendered.html,
    text: rendered.text,
    tags: [
      { name: "template_key", value: "order_confirmation" },
      { name: "order_number", value: input.context.orderNumber },
    ],
  });
}

export async function sendShippingUpdateEmail(input: {
  to: string;
  from: string;
  subject?: string;
  context: ShippingUpdateContext;
}): Promise<SendEmailResult> {
  const rendered = renderShippingUpdate(input.context);
  return sendEmail({
    to: input.to,
    from: input.from,
    subject: input.subject ?? `Shipping Update: ${input.context.orderNumber}`,
    html: rendered.html,
    text: rendered.text,
    tags: [
      { name: "template_key", value: "shipping_update" },
      { name: "order_number", value: input.context.orderNumber },
    ],
  });
}

export async function sendAbandonedCartEmail(input: {
  to: string;
  from: string;
  subject?: string;
  cartId: string;
  context: AbandonedCartContext;
}): Promise<SendEmailResult> {
  const rendered = renderAbandonedCart(input.context);
  return sendEmail({
    to: input.to,
    from: input.from,
    subject: input.subject ?? "Your cart is waiting",
    html: rendered.html,
    text: rendered.text,
    tags: [
      { name: "template_key", value: "abandoned_cart_reminder" },
      { name: "cart_id", value: input.cartId },
    ],
  });
}
