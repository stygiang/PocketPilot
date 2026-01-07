import Image from 'next/image';
import Link from 'next/link';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
);

export default function MarketingPage() {
  return (
    <main className="pb-24">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
        <Container>
          <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
            <Link href="/" className="flex items-center">
              <Image
                src="/pocketpilot-logo.png"
                alt="PocketPilot"
                width={190}
                height={80}
                className="h-12 w-auto"
              />
              <span className="sr-only">PocketPilot</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
              <Link href="#how">How it works</Link>
              <Link href="#download" className="rounded-full bg-ink px-5 py-2 text-sm text-white">
                Download app
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="#download" className="rounded-full bg-ink px-4 py-2 text-xs text-white">
                Download
              </Link>
            </div>
          </nav>
        </Container>
      </header>

      <section className="pt-12">
        <Container>
          <div className="rounded-[28px] bg-[#f3eee6] px-8 py-10 md:px-12 md:py-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.05fr,0.95fr]">
              <div>
                <h1 className="text-4xl font-display text-ink md:text-5xl">
                  Take control of what you spend with PocketPilot.
                </h1>
                <p className="mt-4 text-sm text-ink/70 md:text-base">
                  PocketPilot tracks your paydays and bills so you can see your safe-to-spend
                  number at a glance. Simple, private, and built for daily decisions.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex w-full max-w-sm items-center rounded-full bg-white px-4 py-2 shadow-sm">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="w-full border-0 bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
                    />
                  </div>
                  <Link
                    href="#download"
                    className="rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink"
                  >
                    Get early access
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-sun/60" />
                <div className="absolute -right-6 bottom-10 h-12 w-12 rounded-full bg-amber/60" />
                <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-lg">
                  <div className="text-xs uppercase tracking-widest text-ink/50">Today</div>
                  <div className="mt-3 text-3xl font-semibold text-ink">$42.00</div>
                  <div className="mt-2 text-sm text-ink/60">Safe to spend</div>
                  <div className="mt-6 space-y-3 text-sm text-ink/70">
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-2">
                      <span>Payday</span>
                      <span>May 31</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-2">
                      <span>Bills reserved</span>
                      <span>$1,215</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-2">
                      <span>Safe per day</span>
                      <span>$17</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="how" className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-display text-ink md:text-4xl">
              Why manage spending with PocketPilot
            </h2>
            <p className="mt-4 text-sm text-ink/70 md:text-base">
              Keep your bills covered, know your daily number, and stay confident before every
              purchase.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Bill-aware budgeting',
                description: 'Your upcoming bills are reserved before you spend.',
              },
              {
                title: 'Daily safe number',
                description: 'See exactly what is safe to use today and this week.',
              },
              {
                title: 'Private by default',
                description: 'No bank connection required. You control the data.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/10 bg-white/80 p-6 text-sm text-ink/70 shadow-sm"
              >
                <div className="text-lg font-semibold text-ink">{item.title}</div>
                <p className="mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="download" className="py-16">
        <Container>
          <div className="rounded-[28px] border border-black/10 bg-white/90 px-8 py-10 text-center shadow-sm">
            <h2 className="text-3xl font-display text-ink md:text-4xl">Get PocketPilot today</h2>
            <p className="mt-3 text-sm text-ink/70 md:text-base">
              Join the waitlist and we will notify you when the app is ready to download.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/coming-soon" className="rounded-full bg-ink px-6 py-3 text-sm text-white">
                Join the waitlist
              </Link>
              <Link
                href="/coming-soon"
                className="rounded-full border border-ink px-6 py-3 text-sm text-ink"
              >
                View coming soon
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-black/10 py-10">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/pocketpilot-logo.png"
                alt="PocketPilot"
                width={190}
                height={48}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-black/60">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <a href="mailto:support@pocketpilot.app">support@pocketpilot.app</a>
            </div>
          </div>
          <div className="mt-6 text-xs text-black/40">
            Copyright {new Date().getFullYear()} PocketPilot. All rights reserved.
          </div>
        </Container>
      </footer>
    </main>
  );
}
