'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';

export default function ComingSoonPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    if (!email) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }

    const res = await fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus('error');
      setMessage(data?.error || 'Unable to subscribe right now.');
      return;
    }

    if (data?.status === 'exists') {
      setStatus('exists');
      setMessage('You are already on the list.');
      return;
    }

    setStatus('success');
    setMessage('You are in. We will email you soon.');
    event.currentTarget.reset();
  };

  return (
    <main className={styles.main}>
      <Image
        src="/coming-soon-landing.png"
        alt="PocketPilot coming soon background"
        fill
        priority
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay} />
      <div className={styles.decorCircle1} />
      <div className={styles.decorCircle2} />

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.logoWrapper}>
            <Image
              src="/pocketpilot-logo.png"
              alt="PocketPilot"
              width={220}
              height={70}
              className={styles.logo}
            />
            <span className="sr-only">PocketPilot</span>
          </div>
          <h1 className={styles.heading}>
            We are almost ready to launch.
          </h1>
          <p className={styles.description}>
            Subscribe to be the first to know about updates and get early access perks.
          </p>
          <form
            className={styles.form}
            onSubmit={onSubmit}
          >
            <input
              type="email"
              name="email"
              placeholder="Please enter your email address"
              className={styles.emailInput}
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : 'Subscribe'}
            </button>
          </form>
          {message ? (
            <div className={styles.message}>
              {message}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
