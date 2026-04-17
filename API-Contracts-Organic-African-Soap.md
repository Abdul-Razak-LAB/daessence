# API Contracts
## Organic African Soap with Aloe Vera Ecommerce

- Version: 1.0
- Date: 2026-04-09
- Base URL: /api
- Content Type: application/json

## 1. Conventions
- Auth:
  - Public endpoints: no authentication (rate limited)
  - Internal admin endpoints: bearer token or session auth (implementation choice)
- Idempotency:
  - Checkout uses `Idempotency-Key` header
- Error shape:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payload",
    "details": [{ "field": "email", "message": "Invalid email" }],
    "requestId": "req_123"
  }
}
```

## 2. Product Endpoints
### GET /products/:slug
Returns active product by slug.

Response 200
```json
{
  "id": "cb0f6ca7-85d5-4444-92eb-7ef6de248b5c",
  "slug": "organic-african-soap-aloe-vera",
  "name": "Organic African Soap with Aloe Vera",
  "shortDescription": "Natural cleansing bar crafted for clearer-looking, glowing skin.",
  "longDescription": "...",
  "price": {
    "amountCents": 1499,
    "saleAmountCents": 1299,
    "currency": "USD"
  },
  "inventory": {
    "availableQty": 250,
    "status": "in_stock"
  },
  "images": [
    { "path": "assets/blacksoap.jpg", "alt": "Organic African black soap product image", "sortOrder": 1 }
  ]
}
```

Errors: 404 if missing/inactive.

## 3. Cart Endpoints
### POST /cart
Creates or restores an active cart.

Request
```json
{
  "email": "buyer@example.com"
}
```

Response 201
```json
{
  "id": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
  "status": "active",
  "email": "buyer@example.com",
  "createdAt": "2026-04-09T10:00:00.000Z"
}
```

### POST /cart/items
Adds item to cart (or increments quantity).

Request
```json
{
  "cartId": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
  "productId": "cb0f6ca7-85d5-4444-92eb-7ef6de248b5c",
  "quantity": 2
}
```

Response 200
```json
{
  "cart": {
    "id": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
    "items": [
      {
        "id": "9ef3ceaa-4408-4449-b52c-3df5a2ca9dd1",
        "productId": "cb0f6ca7-85d5-4444-92eb-7ef6de248b5c",
        "quantity": 2,
        "unitPriceCents": 1299,
        "lineTotalCents": 2598
      }
    ],
    "totals": {
      "subtotalCents": 2598,
      "discountCents": 0,
      "shippingCents": 0,
      "totalCents": 2598
    }
  }
}
```

Errors: 409 on insufficient stock.

### PATCH /cart/items/:id
Updates quantity or removes item when quantity is 0.

Request
```json
{
  "quantity": 1
}
```

Response 200 mirrors cart response above.

## 4. Coupon Endpoint
### POST /cart/apply-coupon
Applies coupon to active cart.

Request
```json
{
  "cartId": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
  "code": "ALOE10"
}
```

Response 200
```json
{
  "cartId": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
  "coupon": {
    "code": "ALOE10",
    "discountType": "percent",
    "discountValue": 10
  },
  "totals": {
    "subtotalCents": 2598,
    "discountCents": 260,
    "shippingCents": 0,
    "totalCents": 2338
  }
}
```

## 5. Checkout Endpoint
### POST /checkout
Creates payment intent and finalizes order on successful authorization.

Headers
- Idempotency-Key: unique-client-key

Request
```json
{
  "cartId": "b44b9f66-a5a1-4fa9-b1ce-3d40c60f211f",
  "customer": {
    "email": "buyer@example.com",
    "fullName": "Ada Mensah",
    "phone": "+233500000000"
  },
  "shippingAddress": {
    "line1": "1 Independence Ave",
    "line2": "",
    "city": "Accra",
    "stateRegion": "Greater Accra",
    "postalCode": "GA-123-4567",
    "countryCode": "GH"
  },
  "billingSameAsShipping": true,
  "payment": {
    "provider": "stripe",
    "paymentMethodId": "pm_123"
  }
}
```

Response 201
```json
{
  "order": {
    "id": "f98f7af4-f0d7-4215-ae45-46995039fcd7",
    "orderNumber": "DAE-20260409-0001",
    "status": "paid",
    "email": "buyer@example.com",
    "totals": {
      "subtotalCents": 2598,
      "discountCents": 260,
      "shippingCents": 0,
      "totalCents": 2338,
      "currency": "USD"
    }
  }
}
```

Errors:
- 400 validation failure
- 402 payment failed
- 409 out of stock
- 422 cart inactive or empty

## 6. Order Email Endpoint
### POST /orders/:id/send-confirmation
Internal endpoint to resend confirmation when needed.

Request
```json
{
  "reason": "customer-requested-copy"
}
```

Response 202
```json
{
  "queued": true,
  "template": "order_confirmation",
  "orderId": "f98f7af4-f0d7-4215-ae45-46995039fcd7"
}
```

## 7. Resend Webhook Endpoint
### POST /webhooks/resend
Receives delivery, bounce, and complaint events.

Request
```json
{
  "type": "email.bounced",
  "created_at": "2026-04-09T10:05:00.000Z",
  "data": {
    "email_id": "f5f3...",
    "to": ["buyer@example.com"],
    "from": "orders@example.com",
    "subject": "Your order is confirmed",
    "tags": [{ "name": "template_key", "value": "order_confirmation" }]
  }
}
```

Response 200
```json
{
  "ok": true
}
```

Requirements:
- Verify webhook signature
- Store event in `email_events`

## 8. Contact Endpoint
### POST /contact
Creates support ticket and optional auto-reply email.

Request
```json
{
  "name": "Kwame Boateng",
  "email": "kwame@example.com",
  "message": "Can I use this soap daily for sensitive skin?"
}
```

Response 201
```json
{
  "id": "53eb4f88-e71f-4a17-bf95-e80495d9d09b",
  "status": "new",
  "createdAt": "2026-04-09T10:07:00.000Z"
}
```

## 9. Validation Rules Summary
- Email fields must be valid RFC-style email format.
- Quantity must be integer >= 0.
- Country code must be ISO-3166-1 alpha-2.
- Coupon code uppercased and trimmed before validation.
- Cart must not be expired/converted at checkout.

## 10. Rate Limits (Suggested)
- GET product: 120 requests per minute per IP
- Cart writes: 40 requests per minute per IP
- Checkout: 10 requests per minute per IP and per cart
- Contact: 5 requests per minute per IP
- Webhooks: allowlisted source plus signature verification
