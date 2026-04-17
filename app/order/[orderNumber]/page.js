import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";

export default async function OrderSuccessPage({ params }) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) return notFound();

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
      </article>
    </div>
  );
}
