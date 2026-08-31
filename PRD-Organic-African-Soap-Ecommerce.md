# Product Requirements Document (PRD)
## Ecommerce Website: Organic African Soap with Aloe Vera

- Version: 1.0
- Date: 2026-04-09
- Author Role: Fullstack Product/Engineering
- Project Codename: Da Essence Organic Soap Commerce

## 1. Product Overview
Build a conversion-focused ecommerce website to sell a hero product: **Organic African Soap with Aloe Vera**. The site should establish trust in product quality and origin, educate users on skincare benefits, and drive direct online sales with email-enabled lifecycle communication.

The solution will use:
- **Neon (PostgreSQL)** for transactional and operational data
- **Resend** for transactional and marketing-compatible emails
- Existing visual assets from `/assets` for brand and product storytelling

## 2. Goals and Success Metrics
### 2.1 Business Goals
- Increase direct-to-consumer online revenue for the hero soap line.
- Improve first-purchase conversion from organic and social traffic.
- Build a qualified email audience for repeat purchases.

### 2.2 Product Goals
- Fast, mobile-first shopping journey from landing to checkout.
- High-trust presentation with authentic product visuals and education.
- Reliable order confirmation and post-purchase communication.

### 2.3 KPIs
- Conversion Rate (sitewide): >= 2.5% within 90 days
- Add-to-Cart Rate: >= 8%
- Checkout Completion Rate: >= 55%
- Email Delivery Rate (transactional): >= 98%
- Average Page Load (LCP mobile): <= 2.5s
- Repeat Purchase Rate (60-day): >= 18%

## 3. Scope
### 3.1 In Scope (MVP)
- Homepage, Product Detail Page (PDP), Cart, Checkout, Order Confirmation, About, Contact
- Single-product catalog initially (variants supported)
- Coupon support (single code at checkout)
- Email flows via Resend (order confirmation, shipping update, abandoned cart reminder)
- Admin-lite capabilities (product inventory, order status updates via internal UI)
- SEO basics (metadata, sitemap, schema.org product markup)

### 3.2 Out of Scope (MVP)
- Full marketplace multi-vendor functionality
- Native mobile apps
- Loyalty points system
- Advanced recommendation engine

## 4. Target Users and Personas
- Skincare-conscious adults (18-45), seeking natural acne and glow solutions.
- Customers preferring African-origin organic products and ingredient transparency.
- Returning customers buying routine skincare replenishments.

### Key Needs
- Proof of ingredient quality and authenticity
- Clear usage instructions and expected results
- Frictionless checkout and trustworthy order updates

## 5. User Stories
- As a visitor, I want to quickly understand soap benefits so that I can decide if it matches my skin needs.
- As a shopper, I want to see ingredient and usage details so that I feel confident purchasing.
- As a shopper, I want a short checkout flow so that I can complete purchase quickly on mobile.
- As a buyer, I want immediate email confirmation so I know my order was successful.
- As an admin, I want to update inventory and order status so customers receive accurate updates.

## 6. Information Architecture and Pages
- Home
- Product Detail (Organic African Soap with Aloe Vera)
- Cart
- Checkout
- Order Success
- About Brand
- Contact/Support
- Policies (Shipping, Returns, Privacy, Terms)

## 7. Asset Usage Plan (Provided Assets)
Use provided files for trust and conversion storytelling.

### 7.1 Brand Assets
- `assets/Da-Essence-Logo-Final.svg`: Header logo, footer logo, email header brand mark
- `assets/favicon.png` and `assets/cropped-favicon.png`: Browser icons

### 7.2 Product and Ingredient Storytelling
- `assets/blacksoap.jpg`, `assets/bar-soap.jpg`: Primary PDP gallery images
- `assets/aloe-vera-slices-skin-care-scaled.jpg`: Aloe vera ingredient section
- `assets/shea-butter.jpg`, `assets/cocoa-pod-scaled.jpg`: Supporting ingredient claims section
- `assets/product-slide-3.jpg` to `assets/product-slide7.jpg`: Homepage carousel and PDP secondary gallery
- `assets/glow-now.jpg`, `assets/acne-solution-now.jpg`, `assets/remedies-to-cure-acne.jpg`: Problem-solution educational blocks

### 7.3 Trust and Brand Story
- `assets/about-image.jpg`, `assets/ceo.jpg`, `assets/leader.png`, `assets/ghana.png`: About page and provenance/trust section

### 7.4 Distribution and Wholesale (Optional MVP section)
- `assets/distributors-banner.jpg`, `assets/distributors-banner1.jpg`, `assets/distributor-link.jpg`: Wholesale CTA section

## 8. Functional Requirements
## 8.1 Catalog and Product
- System shall support one live product with future-ready multi-product schema.
- PDP shall display:
  - Product name, short and long description
  - Benefits bullets (acne support, glow, gentle cleansing)
  - Ingredients (including aloe vera)
  - Price and sale price (if active)
  - Inventory status (in stock, low stock, out of stock)
  - Product image gallery from provided assets
- Quantity selector with min=1 and max by inventory threshold.

## 8.2 Cart and Checkout
- Cart supports add, remove, quantity update.
- Coupon code field validates against active promotions.
- Checkout captures:
  - Customer name
  - Email
  - Phone (optional)
  - Shipping address
  - Billing address (toggle same as shipping)
- Payment gateway integration placeholder (provider to be finalized).
- Order record created only after successful payment authorization.

## 8.3 Orders and Post-Purchase
- Order lifecycle statuses: `pending`, `paid`, `packed`, `shipped`, `delivered`, `cancelled`, `refunded`.
- Order success page shows order number and summary.
- Resend transactional emails:
  - Order confirmation on successful payment
  - Shipping update when status becomes `shipped`

## 8.4 Abandoned Cart Email
- If cart not converted within 2 hours and email available, send abandoned cart reminder.
- Maximum 1 reminder per cart session.

## 8.5 Contact and Support
- Contact form with name, email, message.
- Support submission stored in Neon and optional auto-reply via Resend.

## 9. Non-Functional Requirements
- Mobile-first responsive design.
- Accessibility target: WCAG 2.1 AA for core flows.
- Performance target: Lighthouse mobile >= 85 for PDP and Home.
- API p95 response under 400ms for core read operations.
- Uptime target: 99.5% monthly.
- Security baseline:
  - Input validation and output encoding
  - CSRF protection for state-changing operations
  - Rate limiting on auth/contact endpoints
  - Secrets in environment variables only

## 10. Technical Architecture
- Frontend: React/Next.js (recommended), SSR/ISR for SEO pages.
- Backend: Next.js API routes or Node service layer.
- Database: Neon PostgreSQL.
- Email: Resend API.
- Media: Existing local assets with optimization pipeline/CDN in production.

### 10.1 High-Level Flow
1. User visits Home/PDP and adds item to cart.
2. Checkout creates payment intent and validates stock.
3. On payment success, order persisted in Neon.
4. Order confirmation sent via Resend.
5. Admin updates shipment status; shipping email triggered via Resend.

## 11. Neon Database Design (MVP)

### 11.1 Core Tables
- `users` (optional guest-first model with future account support)
- `products`
- `product_images`
- `inventory`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `addresses`
- `coupons`
- `coupon_redemptions`
- `email_events`
- `contact_messages`

### 11.2 Suggested PostgreSQL Schema (Starter)
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  long_description text,
  price_cents int not null check (price_cents >= 0),
  sale_price_cents int check (sale_price_cents >= 0),
  currency char(3) not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_path text not null,
  alt_text text,
  sort_order int not null default 0
);

create table inventory (
  product_id uuid primary key references products(id) on delete cascade,
  available_qty int not null default 0 check (available_qty >= 0),
  updated_at timestamptz not null default now()
);

create table carts (
  id uuid primary key default gen_random_uuid(),
  email text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null check (quantity > 0),
  unit_price_cents int not null check (unit_price_cents >= 0)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  email text not null,
  status text not null,
  subtotal_cents int not null,
  discount_cents int not null default 0,
  shipping_cents int not null default 0,
  total_cents int not null,
  currency char(3) not null default 'USD',
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name_snapshot text not null,
  quantity int not null check (quantity > 0),
  unit_price_cents int not null
);

create table email_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  email text not null,
  template_key text not null,
  provider_message_id text,
  status text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
```

## 12. Resend Email Requirements
### 12.1 Templates
- `order_confirmation`
- `shipping_update`
- `abandoned_cart_reminder`
- `contact_auto_reply` (optional)

### 12.2 Email Content Minimum Fields
- Brand logo (Da Essence)
- Customer first name (fallback: Customer)
- Order number
- Product summary, quantity, amount paid
- CTA button (View Order / Continue Checkout)
- Support contact details

### 12.3 Trigger Rules
- `order_confirmation`: event = order paid
- `shipping_update`: event = order status changed to shipped
- `abandoned_cart_reminder`: cart inactive for 2 hours, no order created

### 12.4 Deliverability Requirements
- Verified sender domain
- SPF, DKIM, DMARC configured
- Bounce and complaint webhooks stored in `email_events`

## 13. API Requirements (Representative)
- `GET /api/products/:slug`
- `POST /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `POST /api/checkout`
- `POST /api/orders/:id/send-confirmation`
- `POST /api/webhooks/resend`
- `POST /api/contact`

All write APIs must validate payload schema and enforce rate limiting.

## 14. Content and UX Requirements
- Homepage hero communicates: natural, organic, African-origin care.
- PDP above-the-fold must include:
  - Product image
  - Price
  - Benefit bullets
  - Add to Cart CTA
- Trust strip near CTA: shipping policy, return policy, secure checkout.
- Ingredient education block using aloe vera and shea/cocoa visuals.
- Reviews section placeholder (MVP can support static seeded testimonials).

## 15. Analytics and Tracking
- Track events: `view_product`, `add_to_cart`, `begin_checkout`, `purchase`, `email_submitted`, `contact_submitted`.
- UTM capture at session start.
- Dashboard-level daily report:
  - Sessions
  - Conversion
  - Revenue
  - Top traffic source

## 16. SEO Requirements
- Unique title and meta description for Home and PDP.
- Product structured data (schema.org/Product with price and availability).
- Optimized image alt text for all product assets.
- XML sitemap and robots configuration.

## 17. QA and Acceptance Criteria
### 17.1 Core Acceptance
- User can complete purchase from PDP to confirmation without blocking errors.
- Inventory decrements on successful purchase only.
- Confirmation email arrives within 2 minutes of paid order.
- Shipping email sends once when status changes to shipped.
- Abandoned cart email sends per rule and does not duplicate.

### 17.2 Test Coverage Targets
- Unit tests for pricing/cart calculations.
- Integration tests for checkout and order creation.
- Email trigger tests with mocked Resend client.
- Basic end-to-end tests for mobile checkout path.

## 18. Rollout Plan
- Phase 1: Design + content integration with provided assets
- Phase 2: Neon schema and API implementation
- Phase 3: Checkout integration + Resend transactional flows
- Phase 4: QA/UAT + analytics + SEO hardening
- Phase 5: Launch + 2-week performance and conversion monitoring

## 19. Risks and Mitigation
- Risk: Payment provider delays
  - Mitigation: Implement provider abstraction layer and staged sandbox testing
- Risk: Email deliverability issues
  - Mitigation: Domain verification and webhook monitoring before launch
- Risk: Asset inconsistency and performance overhead
  - Mitigation: Image optimization, naming map, alt-text QA pass

## 20. Open Questions
- Which payment gateway is preferred for target markets?
- Which default shipping zones/rates are required at launch?
- Should guest checkout be the only option in MVP?
- Do we need multilingual support at launch?

## 21. Definition of Done (MVP)
- All in-scope pages implemented and responsive.
- Neon schema deployed and seeded with hero product.
- Resend templates live and trigger rules verified.
- Checkout path stable and measurable via analytics.
- Stakeholder sign-off on QA checklist and launch readiness.
