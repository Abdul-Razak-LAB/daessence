import { CartClient } from "@/components/CartClient";

export const metadata = {
  title: "Cart | Da Essence",
};

export default function CartPage() {
  return (
    <div className="container section">
      <CartClient />
    </div>
  );
}
