import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container section">
      <article className="card" style={{ padding: 18 }}>
        <h1 style={{ marginTop: 0 }}>Page Not Found</h1>
        <p>The page you requested does not exist.</p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </article>
    </div>
  );
}
