import { randomUUID } from "node:crypto";
import { query, getDb } from "@/lib/db";
import { appConfig } from "@/lib/config";
import { moneyFromCents } from "@/lib/utils";

const heroProduct = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: appConfig.productSlug,
  name: "Organic African Soap with Aloe Vera",
  short_description: "Natural cleansing bar crafted for clearer-looking, glowing skin.",
  long_description:
    "Organic African Soap with Aloe Vera combines traditional African black soap principles with soothing aloe vera support for daily cleansing and visibly balanced skin.",
  price_cents: 1499,
  sale_price_cents: 1299,
  currency: "USD",
  is_active: true,
};

const heroImages = [
  ["/assets/blacksoap.jpg", "Organic African black soap product image", 1],
  ["/assets/bar-soap.jpg", "Aloe vera organic soap bar close-up", 2],
  ["/assets/aloe-vera-slices-skin-care-scaled.jpg", "Fresh aloe vera ingredient visual", 3],
  ["/assets/product-slide-3.jpg", "Product lifestyle image", 4],
  ["/assets/product-slide-4.jpg", "Product lifestyle image", 5],
];

const memory = {
  products: [heroProduct],
  inventory: new Map([[heroProduct.id, 250]]),
  carts: new Map(),
  orders: new Map(),
  coupons: new Map([["ALOE10", { code: "ALOE10", discount_type: "percent", discount_value: 10 }]]),
};

function dbEnabled() {
  return Boolean(getDb());
}

function hydrateProduct(row, images = [], qty = 0) {
  const priceCents = row.sale_price_cents || row.price_cents;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    benefits: ["Acne support", "Glow support", "Gentle cleansing"],
    ingredients: ["Organic African Black Soap", "Aloe Vera", "Shea Butter", "Cocoa Pod Ash"],
    price: {
      amountCents: row.price_cents,
      saleAmountCents: row.sale_price_cents,
      currency: row.currency,
      display: moneyFromCents(priceCents, row.currency),
    },
    inventory: {
      availableQty: qty,
      status: qty > 10 ? "in_stock" : qty > 0 ? "low_stock" : "out_of_stock",
    },
    images,
  };
}

export async function getProductBySlug(slug) {
  if (!dbEnabled()) {
    const found = memory.products.find((p) => p.slug === slug && p.is_active);
    if (!found) {
      return null;
    }
    const qty = memory.inventory.get(found.id) || 0;
    const images = heroImages.map(([path, alt, sortOrder]) => ({ path, alt, sortOrder }));
    return hydrateProduct(found, images, qty);
  }

  const productRes = await query("select * from products where slug = $1 and is_active = true limit 1", [slug]);
  if (productRes.rows.length === 0) {
    return null;
  }

  const product = productRes.rows[0];
  const imagesRes = await query(
    "select image_path, alt_text, sort_order from product_images where product_id = $1 order by sort_order asc",
    [product.id]
  );
  const inventoryRes = await query("select available_qty from inventory where product_id = $1", [product.id]);

  return hydrateProduct(
    product,
    imagesRes.rows.map((img) => ({ path: img.image_path.startsWith("/") ? img.image_path : `/${img.image_path}`, alt: img.alt_text, sortOrder: img.sort_order })),
    inventoryRes.rows[0]?.available_qty || 0
  );
}

async function loadCartItemsDb(cartId) {
  const result = await query(
    `select ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.unit_price_cents,
            p.name as product_name, p.currency
     from cart_items ci
     join products p on p.id = ci.product_id
     where ci.cart_id = $1`,
    [cartId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    cartId: row.cart_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    lineTotalCents: row.unit_price_cents * row.quantity,
    currency: row.currency || "USD",
  }));
}

function toCartTotals(items, discount = 0) {
  const subtotal = items.reduce((acc, item) => acc + item.lineTotalCents, 0);
  return {
    subtotalCents: subtotal,
    discountCents: discount,
    shippingCents: 0,
    totalCents: Math.max(subtotal - discount, 0),
  };
}

export async function createCart(email) {
  if (!dbEnabled()) {
    const id = randomUUID();
    const cart = { id, email: email || null, status: "active", items: [], coupon: null, createdAt: new Date().toISOString(), abandonedReminderSentAt: null };
    memory.carts.set(id, cart);
    return cart;
  }

  const result = await query(
    "insert into carts (id, email, status) values ($1, $2, 'active') returning id, email, status, created_at",
    [randomUUID(), email || null]
  );
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    status: result.rows[0].status,
    createdAt: result.rows[0].created_at,
    items: [],
  };
}

export async function getCart(cartId) {
  if (!dbEnabled()) {
    const cart = memory.carts.get(cartId);
    if (!cart) return null;

    const normalizedItems = cart.items.map((item) => ({
      ...item,
      lineTotalCents: item.unitPriceCents * item.quantity,
    }));
    const discount = cart.coupon?.discountCents || 0;
    return {
      id: cart.id,
      status: cart.status,
      email: cart.email,
      items: normalizedItems,
      coupon: cart.coupon,
      totals: toCartTotals(normalizedItems, discount),
    };
  }

  const cartRes = await query("select id, email, status from carts where id = $1 limit 1", [cartId]);
  if (cartRes.rows.length === 0) return null;

  const cart = cartRes.rows[0];
  const items = await loadCartItemsDb(cartId);
  return {
    id: cart.id,
    email: cart.email,
    status: cart.status,
    items,
    totals: toCartTotals(items),
  };
}

export async function addCartItem({ cartId, productId, quantity }) {
  if (!dbEnabled()) {
    const cart = memory.carts.get(cartId);
    if (!cart) throw new Error("Cart not found");
    const product = memory.products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");

    const unit = product.sale_price_cents || product.price_cents;
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        id: randomUUID(),
        cartId,
        productId,
        productName: product.name,
        quantity,
        unitPriceCents: unit,
        currency: product.currency,
      });
    }
    return getCart(cartId);
  }

  const productRes = await query("select id, name, currency, price_cents, sale_price_cents from products where id = $1", [productId]);
  if (productRes.rows.length === 0) {
    throw new Error("Product not found");
  }

  const product = productRes.rows[0];
  const unitPriceCents = product.sale_price_cents || product.price_cents;

  await query(
    `insert into cart_items (id, cart_id, product_id, quantity, unit_price_cents)
     values ($1, $2, $3, $4, $5)
     on conflict (cart_id, product_id)
     do update set quantity = cart_items.quantity + excluded.quantity, updated_at = now()`,
    [randomUUID(), cartId, productId, quantity, unitPriceCents]
  );

  return getCart(cartId);
}

export async function updateCartItem(itemId, quantity) {
  if (!dbEnabled()) {
    for (const cart of memory.carts.values()) {
      const idx = cart.items.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        if (quantity === 0) {
          cart.items.splice(idx, 1);
        } else {
          cart.items[idx].quantity = quantity;
        }
        return getCart(cart.id);
      }
    }
    throw new Error("Cart item not found");
  }

  const itemRes = await query("select cart_id from cart_items where id = $1", [itemId]);
  if (itemRes.rows.length === 0) throw new Error("Cart item not found");
  const cartId = itemRes.rows[0].cart_id;

  if (quantity === 0) {
    await query("delete from cart_items where id = $1", [itemId]);
  } else {
    await query("update cart_items set quantity = $1, updated_at = now() where id = $2", [quantity, itemId]);
  }

  return getCart(cartId);
}

export async function applyCoupon(cartId, rawCode) {
  const code = rawCode.trim().toUpperCase();
  if (!dbEnabled()) {
    const cart = memory.carts.get(cartId);
    if (!cart) throw new Error("Cart not found");
    const coupon = memory.coupons.get(code);
    if (!coupon) throw new Error("Invalid coupon code");

    const snapshot = await getCart(cartId);
    const subtotal = snapshot.totals.subtotalCents;
    const discountCents = coupon.discount_type === "percent" ? Math.round(subtotal * (coupon.discount_value / 100)) : coupon.discount_value;
    cart.coupon = { ...coupon, discountCents };
    return {
      cartId,
      coupon: { code: coupon.code, discountType: coupon.discount_type, discountValue: coupon.discount_value },
      totals: toCartTotals(snapshot.items, discountCents),
    };
  }

  const cart = await getCart(cartId);
  if (!cart) throw new Error("Cart not found");
  const res = await query("select code, discount_type, discount_value, is_active from coupons where code = $1 limit 1", [code]);
  if (res.rows.length === 0 || !res.rows[0].is_active) {
    throw new Error("Invalid coupon code");
  }
  const coupon = res.rows[0];
  const discountCents =
    coupon.discount_type === "percent"
      ? Math.round(cart.totals.subtotalCents * (coupon.discount_value / 100))
      : coupon.discount_value;
  return {
    cartId,
    coupon: { code: coupon.code, discountType: coupon.discount_type, discountValue: coupon.discount_value },
    totals: toCartTotals(cart.items, discountCents),
  };
}

export async function createOrderFromCart({ cartId, customer, shippingAddress, payment, discountCents = 0, orderNumber }) {
  if (!dbEnabled()) {
    const cart = await getCart(cartId);
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty or missing");

    const totals = toCartTotals(cart.items, discountCents || cart.coupon?.discountCents || 0);
    const order = {
      id: randomUUID(),
      orderNumber,
      email: customer.email,
      status: "paid",
      items: cart.items,
      customer,
      shippingAddress,
      totals,
      paymentProvider: payment.provider,
      createdAt: new Date().toISOString(),
      trackingNumber: null,
      carrierName: null,
    };
    memory.orders.set(order.id, order);
    memory.carts.delete(cartId);
    return order;
  }

  const cart = await getCart(cartId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty or missing");

  const discount = discountCents || 0;
  const totals = toCartTotals(cart.items, discount);

  const shipAddressId = randomUUID();
  await query(
    `insert into addresses (id, full_name, line1, line2, city, state_region, postal_code, country_code, phone)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      shipAddressId,
      customer.fullName,
      shippingAddress.line1,
      shippingAddress.line2 || null,
      shippingAddress.city,
      shippingAddress.stateRegion || null,
      shippingAddress.postalCode || null,
      shippingAddress.countryCode.toUpperCase(),
      customer.phone || null,
    ]
  );

  const orderId = randomUUID();
  await query(
    `insert into orders (
      id, order_number, email, status, shipping_address_id, billing_address_id,
      subtotal_cents, discount_cents, shipping_cents, total_cents, currency, payment_provider, payment_reference
    ) values ($1,$2,$3,'paid',$4,$4,$5,$6,0,$7,'USD',$8,$9)`,
    [
      orderId,
      orderNumber,
      customer.email,
      shipAddressId,
      totals.subtotalCents,
      totals.discountCents,
      totals.totalCents,
      payment.provider,
      payment.paymentMethodId,
    ]
  );

  for (const item of cart.items) {
    await query(
      `insert into order_items (id, order_id, product_id, product_name_snapshot, quantity, unit_price_cents)
       values ($1,$2,$3,$4,$5,$6)`,
      [randomUUID(), orderId, item.productId, item.productName, item.quantity, item.unitPriceCents]
    );

    await query(
      "update inventory set available_qty = greatest(available_qty - $1, 0), updated_at = now() where product_id = $2",
      [item.quantity, item.productId]
    );
  }

  await query("update carts set status = 'converted', updated_at = now() where id = $1", [cartId]);

  return {
    id: orderId,
    orderNumber,
    email: customer.email,
    status: "paid",
    items: cart.items,
    totals,
    customer,
    shippingAddress,
    createdAt: new Date().toISOString(),
  };
}

export async function getOrderByNumber(orderNum) {
  if (!dbEnabled()) {
    for (const order of memory.orders.values()) {
      if (order.orderNumber === orderNum) return order;
    }
    return null;
  }

  const orderRes = await query(
    "select id, order_number, email, status, subtotal_cents, discount_cents, shipping_cents, total_cents, currency from orders where order_number = $1 limit 1",
    [orderNum]
  );
  if (orderRes.rows.length === 0) return null;

  const row = orderRes.rows[0];
  const itemsRes = await query(
    "select product_name_snapshot, quantity, unit_price_cents from order_items where order_id = $1",
    [row.id]
  );

  return {
    id: row.id,
    orderNumber: row.order_number,
    email: row.email,
    status: row.status,
    items: itemsRes.rows.map((item) => ({
      productName: item.product_name_snapshot,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
      lineTotalCents: item.unit_price_cents * item.quantity,
    })),
    totals: {
      subtotalCents: row.subtotal_cents,
      discountCents: row.discount_cents,
      shippingCents: row.shipping_cents,
      totalCents: row.total_cents,
      currency: row.currency,
    },
  };
}

export async function getOrderById(orderId) {
  if (!dbEnabled()) {
    return memory.orders.get(orderId) || null;
  }
  const res = await query("select id, order_number, email, status from orders where id = $1 limit 1", [orderId]);
  return res.rows[0] || null;
}

export async function updateOrderStatus(orderId, status, trackingNumber, carrierName) {
  if (!dbEnabled()) {
    const order = memory.orders.get(orderId);
    if (!order) return null;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrierName) order.carrierName = carrierName;
    return order;
  }

  const res = await query(
    `update orders
     set status = $1,
         shipped_at = case when $1 = 'shipped' then now() else shipped_at end,
         delivered_at = case when $1 = 'delivered' then now() else delivered_at end,
         updated_at = now()
     where id = $2
     returning id, order_number, email, status`,
    [status, orderId]
  );
  return res.rows[0] || null;
}

export async function saveEmailEvent({ orderId, cartId, email, templateKey, providerMessageId, status, metadata }) {
  if (!dbEnabled()) {
    return;
  }

  await query(
    `insert into email_events (id, order_id, cart_id, email, template_key, provider_message_id, status, metadata)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [randomUUID(), orderId || null, cartId || null, email, templateKey, providerMessageId || null, status, metadata || null]
  );
}

export async function createContactMessage({ name, email, message }) {
  if (!dbEnabled()) {
    return {
      id: randomUUID(),
      name,
      email,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };
  }

  const res = await query(
    "insert into contact_messages (id, name, email, message, status) values ($1,$2,$3,$4,'new') returning id, status, created_at",
    [randomUUID(), name, email, message]
  );

  return {
    id: res.rows[0].id,
    status: res.rows[0].status,
    createdAt: res.rows[0].created_at,
  };
}

export async function listAbandonedCarts(cutoffMinutes = 120) {
  if (!dbEnabled()) {
    const cutoff = Date.now() - cutoffMinutes * 60 * 1000;
    return Array.from(memory.carts.values())
      .filter((cart) => cart.status === "active" && cart.email && !cart.abandonedReminderSentAt)
      .filter((cart) => new Date(cart.createdAt).getTime() < cutoff)
      .filter((cart) => cart.items.length > 0)
      .map((cart) => ({ id: cart.id, email: cart.email, items: cart.items }));
  }

  const res = await query(
    `select c.id, c.email
     from carts c
     where c.status = 'active'
       and c.email is not null
       and c.abandoned_reminder_sent_at is null
       and c.updated_at < now() - ($1::text || ' minutes')::interval`,
    [String(cutoffMinutes)]
  );

  const carts = [];
  for (const row of res.rows) {
    const details = await getCart(row.id);
    if (details?.items?.length) {
      carts.push({ id: row.id, email: row.email, items: details.items });
    }
  }

  return carts;
}

export async function markAbandonedReminderSent(cartId) {
  if (!dbEnabled()) {
    const cart = memory.carts.get(cartId);
    if (cart) {
      cart.abandonedReminderSentAt = new Date().toISOString();
    }
    return;
  }

  await query("update carts set abandoned_reminder_sent_at = now(), updated_at = now() where id = $1", [cartId]);
}
