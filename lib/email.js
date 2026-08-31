import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resend } from "resend";
import { appConfig } from "@/lib/config";

const templateDir = join(process.cwd(), "emails", "resend", "templates");

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function loadTemplate(baseName) {
  return {
    html: readFileSync(join(templateDir, `${baseName}.html`), "utf8"),
    text: readFileSync(join(templateDir, `${baseName}.txt`), "utf8"),
  };
}

function fill(template, values) {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.replaceAll(`{{${key}}}`, String(value ?? ""));
  }
  return out;
}

function renderItemsHtml(items) {
  return items
    .map((item) => `<p style=\"margin:0 0 6px;\">${item.productName || item.name} x${item.quantity} - ${item.lineTotal}</p>`)
    .join("\n");
}

function renderItemsText(items) {
  return items.map((item) => `- ${item.productName || item.name} x${item.quantity} = ${item.lineTotal}`).join("\n");
}

async function send({ to, subject, html, text, tags = [] }) {
  const resend = getResendClient();
  if (!resend) {
    return { accepted: false, skipped: true, error: "RESEND_API_KEY missing" };
  }

  const response = await resend.emails.send({
    from: appConfig.resendFrom,
    to,
    subject,
    html,
    text,
    tags,
  });

  if (response.error) {
    return { accepted: false, skipped: false, error: response.error.message };
  }

  return { accepted: true, skipped: false, id: response.data?.id };
}

export async function sendOrderConfirmation({ order, viewOrderUrl, supportEmail }) {
  const t = loadTemplate("order-confirmation");
  const items = order.items.map((item) => ({
    ...item,
    lineTotal: `$${(item.lineTotalCents / 100).toFixed(2)}`,
  }));

  const values = {
    brandLogoUrl: `${appConfig.appBaseUrl}/assets/Da-Essence-Logo-Final.svg`,
    supportEmail: supportEmail || appConfig.supportEmail,
    customerFirstName: order.customer?.fullName?.split(" ")[0] || "Customer",
    orderNumber: order.orderNumber,
    orderDate: new Date().toLocaleDateString(),
    orderItemsHtml: renderItemsHtml(items),
    orderItemsText: renderItemsText(items),
    subtotal: `$${(order.totals.subtotalCents / 100).toFixed(2)}`,
    discount: `$${(order.totals.discountCents / 100).toFixed(2)}`,
    shipping: `$${(order.totals.shippingCents / 100).toFixed(2)}`,
    totalPaid: `$${(order.totals.totalCents / 100).toFixed(2)}`,
    viewOrderUrl,
  };

  return send({
    to: order.email,
    subject: `Order Confirmed: ${order.orderNumber}`,
    html: fill(t.html, values),
    text: fill(t.text, values),
    tags: [
      { name: "template_key", value: "order_confirmation" },
      { name: "order_number", value: order.orderNumber },
    ],
  });
}

export async function sendShippingUpdate({ order, trackingNumber, carrierName, trackingUrl }) {
  const t = loadTemplate("shipping-update");
  const values = {
    brandLogoUrl: `${appConfig.appBaseUrl}/assets/Da-Essence-Logo-Final.svg`,
    supportEmail: appConfig.supportEmail,
    customerFirstName: order.customer?.fullName?.split(" ")[0] || "Customer",
    orderNumber: order.order_number || order.orderNumber,
    carrierName: carrierName || "Local Carrier",
    trackingNumber: trackingNumber || "Pending",
    trackingUrl: trackingUrl || appConfig.appBaseUrl,
  };

  return send({
    to: order.email,
    subject: `Shipping Update: ${order.order_number || order.orderNumber}`,
    html: fill(t.html, values),
    text: fill(t.text, values),
    tags: [
      { name: "template_key", value: "shipping_update" },
      { name: "order_number", value: order.order_number || order.orderNumber },
    ],
  });
}

export async function sendAbandonedCart({ email, cartId, items, resumeCheckoutUrl }) {
  const t = loadTemplate("abandoned-cart");
  const formatted = items.map((item) => ({
    ...item,
    lineTotal: `$${(item.lineTotalCents / 100).toFixed(2)}`,
  }));

  const values = {
    brandLogoUrl: `${appConfig.appBaseUrl}/assets/Da-Essence-Logo-Final.svg`,
    supportEmail: appConfig.supportEmail,
    customerFirstName: "Customer",
    cartItemsHtml: renderItemsHtml(formatted),
    cartItemsText: renderItemsText(formatted),
    resumeCheckoutUrl,
  };

  return send({
    to: email,
    subject: "Your cart is waiting",
    html: fill(t.html, values),
    text: fill(t.text, values),
    tags: [
      { name: "template_key", value: "abandoned_cart_reminder" },
      { name: "cart_id", value: cartId },
    ],
  });
}

export async function sendContactAutoReply({ email, name }) {
  const firstName = (name || "Customer").trim().split(" ")[0] || "Customer";
  const subject = "We received your message";
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1d1f1a;line-height:1.5;max-width:560px;">
      <p>Hi ${firstName},</p>
      <p>Thanks for contacting ${appConfig.appName}. We received your message and will reply as soon as possible.</p>
      <p>If your request is urgent, email us at <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>.</p>
      <p>Warm regards,<br />${appConfig.appName} Support</p>
    </div>
  `;
  const text = [
    `Hi ${firstName},`,
    "",
    `Thanks for contacting ${appConfig.appName}. We received your message and will reply as soon as possible.`,
    `If your request is urgent, email us at ${appConfig.supportEmail}.`,
    "",
    `${appConfig.appName} Support`,
  ].join("\n");

  return send({
    to: email,
    subject,
    html,
    text,
    tags: [{ name: "template_key", value: "contact_auto_reply" }],
  });
}

export async function sendContactSupportNotification({ name, email, message, submittedAt }) {
  const subject = `New contact message from ${name}`;
  const safeMessage = String(message || "").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const submittedLabel = submittedAt ? new Date(submittedAt).toLocaleString() : new Date().toLocaleString();

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1d1f1a;line-height:1.5;max-width:640px;">
      <h2 style="margin:0 0 12px;">New Contact Submission</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p style="margin:0 0 8px;"><strong>Submitted:</strong> ${submittedLabel}</p>
      <p style="margin:12px 0 6px;"><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f2e7;border:1px solid #d8cfbb;padding:12px;border-radius:8px;margin:0;">${safeMessage}</pre>
    </div>
  `;

  const text = [
    "New Contact Submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Submitted: ${submittedLabel}`,
    "",
    "Message:",
    message,
  ].join("\n");

  return send({
    to: appConfig.contactInboxEmail,
    subject,
    html,
    text,
    tags: [{ name: "template_key", value: "contact_support_notification" }],
  });
}
