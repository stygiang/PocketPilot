import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
        <h1 className="mt-6 text-4xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-black/70">
          PocketPilot is provided as-is for personal finance planning. You control your data and
          can cancel anytime.
        </p>
        <p className="mt-4 text-sm text-black/70">
          Contact support@safetospend.app with questions.
        </p>
      </div>
    </main>
  );
}
