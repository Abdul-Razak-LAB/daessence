import { AdminStatusForm } from "@/components/AdminStatusForm";

export const metadata = {
  title: "Admin | Da Essence",
};

export default function AdminPage() {
  return (
    <div className="container section">
      <AdminStatusForm />
    </div>
  );
}
