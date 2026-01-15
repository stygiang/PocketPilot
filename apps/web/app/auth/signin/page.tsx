'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back button */}
        <Link href="/auth/welcome" className={styles.backButton}>
          ← Back
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            If you already have a Safe to Spend account, sign in below to proceed.
          </p>
        </div>

        {/* Apple Sign In */}
        <button className={styles.appleButton}>
          <span className={styles.appleIcon}>🍎</span>
          Sign in with Apple
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>OR ENTER YOUR EMAIL</span>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        {/* Forgot Password */}
        <div className={styles.forgotPassword}>
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </div>

        {/* Sign Up Link */}
        <div className={styles.signUpLink}>
          Don't have an account?{' '}
          <Link href="/auth/signup">Sign up →</Link>
        </div>
      </div>
    </main>
  );
}
