import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.container}>{children}</div>
);

export default function MarketingPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Container>
          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/pocketpilot-logo.png"
                alt="PocketPilot"
                width={190}
                height={80}
                className={styles.logo}
              />
              <span className="sr-only">PocketPilot</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="#how">How it works</Link>
              <Link href="/auth/welcome" className={styles.navLinkDesktop}>
                Get Started
              </Link>
            </div>
            <div className={styles.navMobile}>
              <Link href="/auth/welcome" className={styles.navLinkMobile}>
                Get Started
              </Link>
            </div>
          </nav>
        </Container>
      </header>

      <section className={styles.heroSection}>
        <Container>
          <div className={styles.heroCard}>
            <div className={styles.heroGrid}>
              <div>
                <h1 className={styles.heroHeading}>
                  Take control of what you spend with PocketPilot.
                </h1>
                <p className={styles.heroText}>
                  PocketPilot tracks your paydays and bills so you can see your safe-to-spend
                  number at a glance. Simple, private, and built for daily decisions.
                </p>
                <div className={styles.heroActions}>
                  <div className={styles.emailInput}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                    />
                  </div>
                  <Link
                    href="/auth/welcome"
                    className={styles.ctaButton}
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>

              <div className={styles.heroImageWrapper}>
                <div className={styles.decorCircle1} />
                <div className={styles.decorCircle2} />
                <div className={styles.demoCard}>
                  <div className={styles.demoLabel}>Today</div>
                  <div className={styles.demoAmount}>$42.00</div>
                  <div className={styles.demoSubtext}>Safe to spend</div>
                  <div className={styles.demoStats}>
                    <div className={styles.demoStatItem}>
                      <span>Payday</span>
                      <span>May 31</span>
                    </div>
                    <div className={styles.demoStatItem}>
                      <span>Bills reserved</span>
                      <span>$1,215</span>
                    </div>
                    <div className={styles.demoStatItem}>
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

      <section id="how" className={styles.howSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>
              Why manage spending with PocketPilot
            </h2>
            <p className={styles.sectionText}>
              Keep your bills covered, know your daily number, and stay confident before every
              purchase.
            </p>
          </div>
          <div className={styles.featuresGrid}>
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
                className={styles.featureCard}
              >
                <div className={styles.featureTitle}>{item.title}</div>
                <p className={styles.featureDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="download" className={styles.downloadSection}>
        <Container>
          <div className={styles.downloadCard}>
            <h2 className={styles.downloadHeading}>Get PocketPilot today</h2>
            <p className={styles.downloadText}>
              Join the waitlist and we will notify you when the app is ready to download.
            </p>
            <div className={styles.downloadActions}>
              <Link href="/auth/welcome" className={styles.downloadButton}>
                Get Started
              </Link>
              <Link
                href="/auth/signin"
                className={styles.downloadButtonSecondary}
              >
                Sign In
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Image
                src="/pocketpilot-logo.png"
                alt="PocketPilot"
                width={190}
                height={48}
              />
            </div>
            <div className={styles.footerLinks}>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <a href="mailto:support@pocketpilot.app">support@pocketpilot.app</a>
            </div>
          </div>
          <div className={styles.copyright}>
            Copyright {new Date().getFullYear()} PocketPilot. All rights reserved.
          </div>
        </Container>
      </footer>
    </main>
  );
}
