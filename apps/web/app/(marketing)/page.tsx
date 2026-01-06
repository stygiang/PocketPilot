import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Safe to spend today',
    description: 'Instantly know what you can spend without jeopardizing bills.',
  },
  {
    title: 'Payday runway',
    description: 'See how far your balance stretches until the next paycheck.',
  },
  {
    title: 'Bill-aware planning',
    description: 'Reserve upcoming bills automatically so you do not overspend.',
  },
  {
    title: 'Quick expense add',
    description: 'Log daily spending in seconds from web or mobile.',
  },
  {
    title: 'Overspend warnings',
    description: 'Get alerted when commitments exceed your balance.',
  },
  {
    title: 'Web + mobile sync',
    description: 'Stay up to date across devices with one shared engine.',
  },
];

const steps = [
  {
    title: 'Add balance + payday',
    description: 'Tell us your current balance and next payday date.',
  },
  {
    title: 'Add bills',
    description: 'List rent, subscriptions, and anything you must pay.',
  },
  {
    title: 'Get your number',
    description: 'We calculate what is safe today and per day.',
  },
];

const testimonials = [
  {
    name: 'Maya Chen',
    role: 'Product Designer',
    quote: 'PocketPilot stopped the paycheck guessing game. I finally know what is safe every day.',
  },
  {
    name: 'Andre Rivera',
    role: 'Nurse',
    quote: 'Takes two minutes to set up and keeps my bills stress-free.',
  },
  {
    name: 'Priya Patel',
    role: 'Freelancer',
    quote: 'The daily number keeps me disciplined without feeling restrictive.',
  },
];

const faqs = [
  {
    question: 'Do I need to connect my bank?',
    answer: 'No. The MVP is manual by design. You enter only what you want.',
  },
  {
    question: 'How is safe to spend calculated?',
    answer: 'We reserve upcoming bills and planned savings, then split what is left across days.',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. Data stays in your account and is never sold.',
  },
  {
    question: 'Can I use it with irregular income?',
    answer: 'Yes. Set custom paydays and update whenever needed.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Yes. The mobile app mirrors the web experience.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Manage your plan from the account page.',
  },
];

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs uppercase tracking-widest">
    {children}
  </span>
);

const buttonStyles = {
  primary: 'primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3',
  secondary: 'secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3',
};

const Button = ({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) => (
  <Link href={href} className={buttonStyles[variant]}>
    {children}
  </Link>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur">
    {children}
  </div>
);

const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) => (
  <div className="text-center">
    <Badge>{eyebrow}</Badge>
    <h2 className="mt-4 text-3xl md:text-4xl">{title}</h2>
    <p className="mt-3 text-sm text-black/70 md:text-base">{subtitle}</p>
  </div>
);

export default function MarketingPage() {
  return (
    <main className="pb-24">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-sand/80 backdrop-blur">
        <Container>
          <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
            <Link href="/" className="flex items-center">
              <Image
                src="/pocketpilot-logo.png"
                alt="PocketPilot"
                width={190}
                height={80}
                className="h-[135px] w-auto"
              />
              <span className="sr-only">PocketPilot</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm md:flex">
              <Link href="#features">Features</Link>
              <Link href="#how">How it Works</Link>
              <Link href="#faq">FAQ</Link>
              <Link href="/coming-soon">Coming Soon</Link>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Button href="#download" variant="secondary">
                Download
              </Button>
              <Button href="/coming-soon">Coming Soon</Button>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <Button href="/coming-soon">Coming Soon</Button>
            </div>
          </nav>
        </Container>
      </header>

      <section className="pt-16 md:pt-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <Badge>Private by default</Badge>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl">
                Know what you can safely spend today.
              </h1>
              <p className="mt-5 max-w-xl text-base text-black/70 md:text-lg">
                Add your balance, paydays, and bills. PocketPilot instantly calculates your daily
                number so you can say yes without stress.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="#download">Download App</Button>
                <Button href="/coming-soon" variant="secondary">
                  Coming Soon
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-black/60">
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  No bank required
                </span>
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  Takes 60 seconds
                </span>
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  Clear alerts
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:justify-self-end">
              <Card>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Today at a glance</span>
                  <span className="text-black/50">Mon</span>
                </div>
                <div className="mt-4 rounded-2xl bg-sand px-4 py-4">
                  <div className="text-xs uppercase tracking-widest text-black/60">Safe Today</div>
                  <div className="text-3xl font-semibold">$42.00</div>
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                    <span>Safe until payday</span>
                    <span className="font-semibold">$510.00</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                    <span>Safe per day</span>
                    <span className="font-semibold">$17.00</span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-black/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-widest text-black/60">
                    Upcoming bills
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Rent</span>
                      <span>$1200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Streaming</span>
                      <span>$15</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="relative mx-auto w-full max-w-xs rounded-[32px] border border-black/10 bg-white/80 p-4 shadow-sm">
                <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/10" />
                <div className="mt-6 rounded-3xl bg-sand px-4 py-5">
                  <div className="text-xs uppercase tracking-widest text-black/60">Mobile</div>
                  <div className="mt-2 text-2xl font-semibold">$42.00</div>
                  <div className="mt-3 text-xs text-black/50">Safe today</div>
                </div>
                <div className="mt-4 rounded-2xl border border-black/10 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Payday</span>
                    <span>May 31</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Bills reserved</span>
                    <span>$1,215</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionTitle
            eyebrow="Loved by busy people"
            title="Real clarity in under a minute"
            subtitle="People using PocketPilot spend with confidence, not guesswork."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name}>
                <p className="text-sm text-black/70">"{item.quote}"</p>
                <div className="mt-4 text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-black/50">{item.role}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="how" className="py-16">
        <Container>
          <SectionTitle
            eyebrow="How it works"
            title="A simple flow that keeps you in control"
            subtitle="No account linking. Just the essentials for a clear daily number."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <div className="text-xs uppercase tracking-widest text-black/50">
                  Step {index + 1}
                </div>
                <div className="mt-3 text-lg font-semibold">{step.title}</div>
                <p className="mt-2 text-sm text-black/70">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="features" className="py-16">
        <Container>
          <SectionTitle
            eyebrow="Features"
            title="Every detail is built for daily decisions"
            subtitle="Know what is safe now, and see how it changes as you spend."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <div className="text-lg font-semibold">{feature.title}</div>
                <p className="mt-2 text-sm text-black/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="faq" className="py-16">
        <Container>
          <SectionTitle
            eyebrow="FAQ"
            title="Everything you need to know"
            subtitle="Short answers to common questions."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <div className="text-sm font-semibold">{faq.question}</div>
                <p className="mt-2 text-sm text-black/70">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="download" className="py-16">
        <Container>
          <div className="rounded-3xl border border-black/10 bg-white/80 px-6 py-10 text-center shadow-sm backdrop-blur">
            <h2 className="text-3xl md:text-4xl">Spend with confidence every day.</h2>
            <p className="mt-3 text-sm text-black/70 md:text-base">
              Start free, stay in control, and see your safe-to-spend number instantly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/coming-soon">Get the App</Button>
              <Button href="/coming-soon" variant="secondary">
                Join the Waitlist
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-black/10 py-10">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div>
                <Image
                  src="/pocketpilot-logo.png"
                  alt="PocketPilot"
                  width={190}
                  height={48}
                  className="h-8 w-auto"
                />
                <div className="mt-2 text-xs text-black/50">Spend smarter, not harder.</div>
              </div>
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

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </main>
  );
}
