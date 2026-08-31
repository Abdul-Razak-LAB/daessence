export const appConfig = {
  appName: "Da Essence",
  productSlug: "organic-african-soap-aloe-vera",
  currency: "USD",
  supportEmail: process.env.RESEND_SUPPORT_EMAIL || "support@daessence.com",
  contactInboxEmail: process.env.RESEND_CONTACT_TO || process.env.RESEND_SUPPORT_EMAIL || "support@daessence.com",
  resendFrom: process.env.RESEND_FROM || "orders@daessence.com",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
};

export function assertEnvForProduction() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.NEON_DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL
  );
  const required = ["RESEND_API_KEY", "RESEND_FROM", "APP_BASE_URL"];
  const missing = required.filter((name) => !process.env[name]);

  if (!hasDatabaseUrl) {
    missing.unshift("DATABASE_URL (or POSTGRES_URL / NEON_DATABASE_URL)");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
