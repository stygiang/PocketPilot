import Link from 'next/link';
import styles from './page.module.scss';

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
        <h1 className={styles.heading}>Terms of Service</h1>
        <p className={styles.paragraph}>
          PocketPilot is provided as-is for personal finance planning. You control your data and
          can cancel anytime.
        </p>
        <p className={styles.paragraph}>
          Contact support@safetospend.app with questions.
        </p>
      </div>
    </main>
  );
}
