# Sprint Backlog
## Organic African Soap with Aloe Vera Ecommerce

- Source PRD: `PRD-Organic-African-Soap-Ecommerce.md`
- Date: 2026-04-09
- Planning Horizon: 4 sprints (2 weeks each)

## Sprint Structure
- Sprint 1: Foundation and Data Layer
- Sprint 2: Storefront and Cart
- Sprint 3: Checkout and Email Automation
- Sprint 4: QA, SEO, Launch Readiness

## Epic 1: Platform Foundation
### Story 1.1: Project scaffold and environment setup
- As a developer, I want a baseline application scaffold so the team can ship features quickly.
- Acceptance Criteria:
  - Local environment variables documented (`DATABASE_URL`, `RESEND_API_KEY`, sender email, app URL).
  - Linting and formatting run successfully.
  - CI pipeline runs tests and build.

### Story 1.2: Shared config and constants
- As a developer, I want centralized configuration so all services use consistent settings.
- Acceptance Criteria:
  - Currency, shipping defaults, and product slug constants in one module.
  - Environment variable validation fails fast on startup.

## Epic 2: Neon Database and Domain Modeling
### Story 2.1: Initial Neon schema migration
- As a backend engineer, I want foundational tables so ecommerce operations persist correctly.
- Acceptance Criteria:
  - Migration creates `products`, `product_images`, `inventory`, `carts`, `cart_items`, `orders`, `order_items`, `email_events`, `contact_messages`, `coupons`, `coupon_redemptions`, `addresses`.
  - Primary/foreign keys and checks are present.
  - Rollback path documented.

### Story 2.2: Seed hero product and media records
- As a content manager, I want seeded catalog data so QA can test the buying journey.
- Acceptance Criteria:
  - Product `organic-african-soap-aloe-vera` inserted with active pricing.
  - Product images mapped to provided assets.
  - Initial stock quantity available.

### Story 2.3: Repository layer and typed models
- As a developer, I want typed DB access patterns so feature code stays reliable.
- Acceptance Criteria:
  - CRUD utilities for products, cart, orders, and contact messages.
  - Consistent error handling for constraint violations.

## Epic 3: Storefront Experience
### Story 3.1: Homepage with product storytelling
- As a visitor, I want to quickly understand product value so I can decide to shop.
- Acceptance Criteria:
  - Hero section with brand logo and key CTA.
  - Ingredient and trust sections use provided assets.
  - Mobile and desktop layouts render without overflow.

### Story 3.2: Product detail page
- As a shopper, I want complete product detail so I can purchase confidently.
- Acceptance Criteria:
  - Name, benefits, ingredient details, price, stock status, image gallery.
  - Add-to-cart action with quantity selector.
  - SEO meta tags and Product schema included.

### Story 3.3: Cart page
- As a shopper, I want to manage items in cart so I can checkout accurately.
- Acceptance Criteria:
  - Update quantity, remove item, apply coupon code.
  - Totals update correctly after each change.

## Epic 4: Checkout and Orders
### Story 4.1: Checkout form and validation
- As a buyer, I want a simple checkout form so I can place order quickly.
- Acceptance Criteria:
  - Required fields validated server-side and client-side.
  - Shipping and billing addresses handled with toggle.
  - Error states are actionable and readable.

### Story 4.2: Order creation and inventory decrement
- As the system, I want atomic order creation so inventory and payment status remain consistent.
- Acceptance Criteria:
  - Order created only after successful payment callback.
  - Inventory decremented for purchased quantities.
  - Duplicate payment callbacks do not create duplicate orders.

### Story 4.3: Order success page
- As a buyer, I want immediate confirmation on-screen so I trust my purchase succeeded.
- Acceptance Criteria:
  - Order number and summary are displayed.
  - No sensitive payment data appears in UI.

## Epic 5: Resend Transactional Email
### Story 5.1: Order confirmation email
- As a buyer, I want order confirmation by email so I have a permanent receipt.
- Acceptance Criteria:
  - Trigger on `order paid` event.
  - Email includes order number, item summary, totals, support contact.
  - Send status logged in `email_events`.

### Story 5.2: Shipping update email
- As a buyer, I want shipping notification so I know when order is in transit.
- Acceptance Criteria:
  - Trigger on status change to `shipped`.
  - Includes carrier/tracking placeholder fields.
  - Single send per status event.

### Story 5.3: Abandoned cart reminder email
- As a shopper, I want a reminder so I can complete my pending purchase.
- Acceptance Criteria:
  - Trigger at 2 hours of inactivity where email is known.
  - Maximum one reminder per cart.
  - Reminder includes resume-checkout CTA.

## Epic 6: Admin-lite Operations
### Story 6.1: Inventory and status management
- As an operator, I want to update inventory and order status so customers receive accurate updates.
- Acceptance Criteria:
  - Auth-protected internal page for stock quantity updates.
  - Order status updates write audit timestamps.
  - Shipping status update triggers email flow.

## Epic 7: Contact and Support
### Story 7.1: Contact form and persistence
- As a customer, I want to send support messages so I can resolve concerns.
- Acceptance Criteria:
  - Contact form stores message in Neon.
  - Optional auto-reply via Resend.
  - Spam/rate limiting baseline in place.

## Epic 8: Analytics, SEO, and Quality
### Story 8.1: Event tracking
- As product team, we want event telemetry so conversion can be improved.
- Acceptance Criteria:
  - Track events: `view_product`, `add_to_cart`, `begin_checkout`, `purchase`, `email_submitted`, `contact_submitted`.
  - UTM values persisted for session attribution.

### Story 8.2: SEO baseline
- As marketing, we want discoverability so qualified organic traffic increases.
- Acceptance Criteria:
  - Home and PDP metadata populated.
  - Sitemap and robots generated.
  - Product structured data validates.

### Story 8.3: Test coverage and release gate
- As engineering, we want reliable release quality so launch risk is reduced.
- Acceptance Criteria:
  - Unit tests for cart/price calculations.
  - Integration tests for checkout-order flow.
  - E2E smoke test for mobile purchase path.

## Definition of Ready (DoR)
- Story includes user role, clear outcome, and acceptance criteria.
- Dependencies identified (e.g., payment provider details).
- UI assets and copy references attached.

## Definition of Done (DoD)
- Acceptance criteria pass.
- Tests added and passing.
- Accessibility check completed for changed UI.
- Tracking and logging included.
- Documentation updated.

## Dependency Notes
- Payment provider selection must be finalized before Story 4.2 production rollout.
- Sender domain verification required before Epic 5 goes live.

## Suggested Sprint Allocation
- Sprint 1: Epic 1 + Epic 2 (Stories 2.1-2.3)
- Sprint 2: Epic 3 + Story 7.1
- Sprint 3: Epic 4 + Epic 5
- Sprint 4: Epic 6 + Epic 8 + launch hardening
