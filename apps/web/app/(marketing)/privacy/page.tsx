import Link from 'next/link';
import styles from './page.module.scss';

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
        <h1 className={styles.heading}>Privacy Policy</h1>
        <p className={styles.paragraph}>
          PocketPilot stores only the data you enter. We do not sell your data or connect to
          your bank in the MVP.
        </p>
        <p className={styles.paragraph}>
          If you have questions, email support@safetospend.app.
        </p>
      </div>
    </main>
  );
}
