import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen text-ink">
      <Image
        src="/coming-soon-landing.png"
        alt="PocketPilot coming soon background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full border border-white/30" />
      <div className="pointer-events-none absolute left-10 top-10 h-16 w-16 rounded-full border border-white/30" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <section className="w-full max-w-4xl text-center text-white">
          <div className="flex items-center justify-center">
            <Image
              src="/pocketpilot-logo.png"
              alt="PocketPilot"
              width={220}
              height={70}
              className="h-12 w-auto"
            />
            <span className="sr-only">PocketPilot</span>
          </div>
          <h1 className="mt-8 text-4xl font-display leading-tight md:text-5xl">
            We are almost ready to launch.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 md:text-base">
            Subscribe to be the first to know about updates and get early access perks.
          </p>
          <form className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              placeholder="Please enter your email address"
              className="h-12 flex-1 rounded-full border border-white/40 bg-white/90 px-4 text-sm text-ink placeholder:text-ink/50"
            />
            <button type="submit" className="h-12 rounded-full bg-sun px-6 text-sm font-semibold text-ink">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
