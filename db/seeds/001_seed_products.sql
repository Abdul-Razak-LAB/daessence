-- 001_seed_products.sql
-- Seed data for Organic African Soap with Aloe Vera

with upsert_product as (
  insert into products (
    slug,
    name,
    short_description,
    long_description,
    price_cents,
    sale_price_cents,
    currency,
    is_active
  ) values (
    'organic-african-soap-aloe-vera',
    'Organic African Soap with Aloe Vera',
    'Natural cleansing bar crafted for clearer-looking, glowing skin.',
    'Organic African Soap with Aloe Vera combines traditional African black soap principles with soothing aloe vera support. It is designed for daily cleansing, helping remove excess oil and impurities while supporting smoother, fresher-looking skin.',
    1499,
    1299,
    'USD',
    true
  )
  on conflict (slug) do update
    set
      name = excluded.name,
      short_description = excluded.short_description,
      long_description = excluded.long_description,
      price_cents = excluded.price_cents,
      sale_price_cents = excluded.sale_price_cents,
      currency = excluded.currency,
      is_active = excluded.is_active,
      updated_at = now()
  returning id
)
insert into product_images (product_id, image_path, alt_text, sort_order)
select p.id, img.image_path, img.alt_text, img.sort_order
from upsert_product p
cross join (
  values
    ('assets/blacksoap.jpg', 'Organic African black soap product image', 1),
    ('assets/bar-soap.jpg', 'Aloe vera organic soap bar close-up', 2),
    ('assets/aloe-vera-slices-skin-care-scaled.jpg', 'Fresh aloe vera ingredient visual', 3),
    ('assets/product-slide-3.jpg', 'Product lifestyle slide 3', 4),
    ('assets/product-slide-4.jpg', 'Product lifestyle slide 4', 5),
    ('assets/product-slide-5.jpg', 'Product lifestyle slide 5', 6),
    ('assets/product-slide6.jpg', 'Product lifestyle slide 6', 7),
    ('assets/product-slide7.jpg', 'Product lifestyle slide 7', 8)
) as img(image_path, alt_text, sort_order)
where not exists (
  select 1
  from product_images pi
  where pi.product_id = p.id
    and pi.image_path = img.image_path
);

insert into inventory (product_id, available_qty)
select id, 250
from products
where slug = 'organic-african-soap-aloe-vera'
on conflict (product_id) do update
  set available_qty = excluded.available_qty,
      updated_at = now();

insert into coupons (code, discount_type, discount_value, max_redemptions, is_active)
values ('ALOE10', 'percent', 10, 1000, true)
on conflict (code) do nothing;
