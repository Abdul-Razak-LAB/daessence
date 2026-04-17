import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact | Da Essence",
};

export default function ContactPage() {
  return (
    <div className="container section">
      <ContactForm />
    </div>
  );
}
