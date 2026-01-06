import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
        <h1 className="mt-6 text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-black/70">
          PocketPilot stores only the data you enter. We do not sell your data or connect to
          your bank in the MVP.
        </p>
        <p className="mt-4 text-sm text-black/70">
          If you have questions, email support@safetospend.app.
        </p>
      </div>
    </main>
  );
}
