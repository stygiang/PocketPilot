'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

type SignUpStep = 'name' | 'email' | 'password';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignUpStep>('name');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setError('');

    if (step === 'name') {
      if (!formData.firstName.trim()) {
        setError('Please enter your first name');
        return;
      }
      setStep('email');
    } else if (step === 'email') {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      setStep('password');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 'email') setStep('name');
    else if (step === 'password') setStep('email');
  };

  const getStepTitle = () => {
    if (step === 'name') return 'Create your account';
    if (step === 'email') return 'What's your email?';
    return 'Create a password';
  };

  const getStepSubtitle = () => {
    if (step === 'name') return 'Let's start with your name';
    if (step === 'email') return 'We'll use this to sign you in';
    return 'Choose a secure password';
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back button */}
        <button className={styles.backButton} onClick={handleBack}>
          ← Back
        </button>

        {/* Progress indicator */}
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{
              width: step === 'name' ? '33%' : step === 'email' ? '66%' : '100%',
            }}
          />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{getStepTitle()}</h1>
          <p className={styles.subtitle}>{getStepSubtitle()}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={step === 'password' ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}
          className={styles.form}
        >
          {error && <div className={styles.error}>{error}</div>}

          {/* Step 1: Name */}
          {step === 'name' && (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>FIRST NAME</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  autoFocus
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>LAST NAME (OPTIONAL)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {/* Step 2: Email */}
          {step === 'email' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                className={styles.input}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoFocus
                required
              />
            </div>
          )}

          {/* Step 3: Password */}
          {step === 'password' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>PASSWORD</label>
              <input
                type="password"
                className={styles.input}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoFocus
                required
                minLength={6}
              />
              <span className={styles.hint}>
                Must be at least 6 characters
              </span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : step === 'password' ? 'Create account' : 'Next'}
          </button>
        </form>

        {/* Sign In Link */}
        {step === 'name' && (
          <div className={styles.signInLink}>
            Already have an account?{' '}
            <Link href="/auth/signin">Log in →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
