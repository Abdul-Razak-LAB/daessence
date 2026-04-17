import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout | Da Essence",
};

export default function CheckoutPage() {
  return (
    <div className="container section">
      <CheckoutForm />
    </div>
  );
}
