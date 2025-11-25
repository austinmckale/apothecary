import Link from "next/link";

export default function ShopSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-lg shadow-emerald-100/50">
        <p className="text-5xl">🌱</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Thank you!</h1>
        <p className="mt-2 text-slate-600">
          We&apos;ve received your order. You&apos;ll get an email with tracking updates shortly.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-white"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}


