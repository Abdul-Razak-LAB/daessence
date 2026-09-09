import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";

export default async function OrderSuccessPage({ params }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) return notFound();

  const whatsappMessage = [
    "Hello Da Essence, I want to confirm my order.",
    `Order number: ${order.orderNumber}`,
    `Status: ${order.status}`,
    "Items:",
    ...order.items.map((item) => `- ${item.productName} x${item.quantity}`),
    `Total: ${moneyFromCents(order.totals.totalCents, order.totals.currency)}`,
  ].join("\n");
  const whatsappHref = `https://wa.me/233599053695?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container section">
      <article className="card" style={{ padding: 18 }}>
        <h1 style={{ marginTop: 0 }}>Order Confirmed</h1>
        <p>Order Number: <strong>{order.orderNumber}</strong></p>
        <p>Status: {order.status}</p>

        <table className="table" aria-label="Order summary">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={`${item.productName}-${idx}`}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{moneyFromCents(item.unitPriceCents)}</td>
                <td>{moneyFromCents(item.lineTotalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          <p>Subtotal: {moneyFromCents(order.totals.subtotalCents)}</p>
          <p>Discount: {moneyFromCents(order.totals.discountCents)}</p>
          <p><strong>Total Paid: {moneyFromCents(order.totals.totalCents)}</strong></p>
        </div>

        <Link href={whatsappHref} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Send Order Details on WhatsApp
        </Link>
      </article>
    </div>
  );
}
