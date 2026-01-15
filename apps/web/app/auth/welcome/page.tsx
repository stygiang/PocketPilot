'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

export default function WelcomePage() {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleDemoMode = async () => {
    setIsLoadingDemo(true);

    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Store demo token
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('is_demo', 'true');

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        alert('Failed to start demo mode');
      }
    } catch (error) {
      console.error('Demo mode error:', error);
      alert('Failed to start demo mode');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Background illustration */}
      <div className={styles.background}>
        <div className={styles.backgroundOverlay} />
      </div>

      {/* Demo mode button */}
      <button
        className={styles.demoButton}
        onClick={() => setShowDemoModal(true)}
      >
        Demo Mode ▸
      </button>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.tagline}>
            Let's Do Money
            <br />
            Better
          </h1>
        </div>

        <div className={styles.actions}>
          {/* Apple Sign In */}
          <button className={styles.appleButton}>
            <span className={styles.appleIcon}>🍎</span>
            Sign up with Apple
          </button>

          {/* Email Sign Up */}
          <Link href="/auth/signup" className={styles.emailButton}>
            Sign up with your email
          </Link>

          {/* Sign In Link */}
          <div className={styles.signInLink}>
            Already have an account?{' '}
            <Link href="/auth/signin">Log in →</Link>
          </div>
        </div>
      </div>

      {/* Demo Mode Modal */}
      {showDemoModal && (
        <>
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowDemoModal(false)}
          />
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Entering demo mode</h2>
            <p className={styles.modalText}>
              Feel free to play around! You'll be able to start setting up your
              Safe to Spend account once you come back.
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowDemoModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDemoMode}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? 'Loading...' : "Let's do this"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
