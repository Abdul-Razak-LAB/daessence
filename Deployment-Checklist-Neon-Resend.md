# Deployment Checklist
## Neon + Resend + Ecommerce Launch

- Date: 2026-04-09
- Scope: Organic African Soap with Aloe Vera MVP

## 1. Environment and Secrets
- [ ] Create production and staging environments.
- [ ] Set required environment variables:
  - [ ] DATABASE_URL (Neon pooled connection string)
  - [ ] RESEND_API_KEY
  - [ ] EMAIL_FROM_ORDERS (for transactional emails)
  - [ ] EMAIL_FROM_SUPPORT
  - [ ] APP_BASE_URL
  - [ ] INTERNAL_ADMIN_TOKEN (if using token-based admin endpoints)
  - [ ] WEBHOOK_SECRET_RESEND
- [ ] Confirm no secrets are committed to repository.

## 2. Neon Provisioning
- [ ] Create Neon project and database.
- [ ] Enable branch strategy:
  - [ ] main branch for production
  - [ ] staging branch for UAT
- [ ] Apply migration file:
  - [ ] db/migrations/001_init_ecommerce.sql
- [ ] Apply seed file in staging first:
  - [ ] db/seeds/001_seed_products.sql
- [ ] Verify table creation and indexes.
- [ ] Verify product seed and inventory row exist.

## 3. Resend Domain Authentication
- [ ] Add sender domain in Resend.
- [ ] Configure DNS records:
  - [ ] SPF
  - [ ] DKIM
  - [ ] DMARC
- [ ] Verify domain status is fully authenticated.
- [ ] Add and verify sender identities used by app.

## 4. Email Template Readiness
- [ ] Validate templates render with real data:
  - [ ] emails/resend/templates/order-confirmation.html
  - [ ] emails/resend/templates/shipping-update.html
  - [ ] emails/resend/templates/abandoned-cart.html
- [ ] Validate plain text versions.
- [ ] Confirm brand logo URL is publicly accessible.
- [ ] Confirm support inbox receives replies.

## 5. Webhooks and Event Logging
- [ ] Create webhook endpoint in app: /api/webhooks/resend
- [ ] Configure Resend webhook with secret signing.
- [ ] Subscribe to event types:
  - [ ] delivered
  - [ ] bounced
  - [ ] complained
  - [ ] failed
- [ ] Verify each event is stored in email_events.
- [ ] Alerting rule created for bounce rate spike.

## 6. API and Security Gate
- [ ] Input schema validation enabled for all write routes.
- [ ] Rate limits configured:
  - [ ] checkout
  - [ ] contact
  - [ ] cart writes
- [ ] CSRF protection enabled for browser session routes.
- [ ] CORS policy reviewed and restricted.
- [ ] HTTPS enforced in production.

## 7. Data Integrity and Ordering Logic
- [ ] Checkout idempotency implemented using Idempotency-Key.
- [ ] Order creation is transactional with inventory decrement.
- [ ] Duplicate payment callback does not duplicate order.
- [ ] Abandoned cart reminder sends only once per cart.

## 8. Performance and SEO
- [ ] Home and PDP Lighthouse mobile score >= 85.
- [ ] Image optimization completed for heavy assets.
- [ ] Product schema.org markup validates.
- [ ] sitemap.xml and robots.txt are accessible.

## 9. QA/UAT Signoff
- [ ] End-to-end path passes: product > cart > checkout > order success.
- [ ] Order confirmation email received within 2 minutes.
- [ ] Shipping update email triggers once at shipped status.
- [ ] Contact form persists and optional auto-reply sends.
- [ ] Mobile responsive checks passed on common breakpoints.

## 10. Launch Day Runbook
- [ ] Deploy backend and frontend.
- [ ] Run migration on production branch.
- [ ] Seed production with final approved product data.
- [ ] Execute smoke tests:
  - [ ] buy flow
  - [ ] confirmation email
  - [ ] webhook event ingestion
- [ ] Enable monitoring dashboard for conversion, errors, and email events.
- [ ] Assign on-call owner for first 72 hours.

## 11. Post-Launch (First 2 Weeks)
- [ ] Daily KPI review (conversion, add-to-cart, checkout completion).
- [ ] Investigate failed checkouts and high drop-off steps.
- [ ] Review bounce/complaint rates and sender reputation.
- [ ] Prioritize backlog improvements based on analytics.
