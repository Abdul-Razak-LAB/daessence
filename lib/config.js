export const appConfig = {
  appName: "Da Essence",
  productSlug: "organic-african-soap-aloe-vera",
  currency: "USD",
  supportEmail: process.env.RESEND_SUPPORT_EMAIL || "support@daessence.com",
  resendFrom: process.env.RESEND_FROM || "orders@daessence.com",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
};

export function assertEnvForProduction() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const required = ["DATABASE_URL", "RESEND_API_KEY", "RESEND_FROM", "APP_BASE_URL"];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
