'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AddAccountModal.module.scss';
import { AccountType, defaultBankColors } from './AccountCard';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: AccountType | null;
}

type TrackingMode = 'MANUAL' | 'AUTOMATIC';

interface AccountFormData {
  name: string;
  type: AccountType;
  trackingMode: TrackingMode;
  institutionName: string;
  lastFourDigits: string;
  currentBalance: string;
  creditLimit: string;
  interestRate: string;
  accountNumber: string;
  routingNumber: string;
}

const accountTypes: { value: AccountType; label: string; icon: string }[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { value: 'DEBIT', label: 'Debit Card', icon: '💳' },
  { value: 'CHECKING', label: 'Checking Account', icon: '🏦' },
  { value: 'SAVINGS', label: 'Savings Account', icon: '🏦' },
  { value: 'INVESTMENT', label: 'Investment Account', icon: '📈' },
  { value: 'LOAN', label: 'Loan', icon: '📋' },
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'OTHER', label: 'Other', icon: '📁' },
];

const popularBanks = [
  'Chase',
  'Bank of America',
  'Wells Fargo',
  'Citi',
  'Capital One',
  'American Express',
  'Discover',
  'US Bank',
  'PNC',
  'TD Bank',
  'Fidelity',
  'Vanguard',
  'Charles Schwab',
];

export default function AddAccountModal({ isOpen, onClose, defaultType }: AddAccountModalProps) {
  const [step, setStep] = useState<'type' | 'tracking' | 'details'>('type');
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: defaultType || 'CHECKING',
    trackingMode: 'MANUAL',
    institutionName: '',
    lastFourDigits: '',
    currentBalance: '',
    creditLimit: '',
    interestRate: '',
    accountNumber: '',
    routingNumber: '',
  });

  const updateFormData = (field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: AccountType) => {
    updateFormData('type', type);
    setStep('tracking');
  };

  const handleTrackingSelect = (mode: TrackingMode) => {
    updateFormData('trackingMode', mode);
    setStep('details');
  };

  const handleSubmit = () => {
    // Here you would submit to your API
    console.log('Submitting account:', formData);
    onClose();
  };

  const handleBack = () => {
    if (step === 'details') setStep('tracking');
    else if (step === 'tracking') setStep('type');
  };

  const renderStep = () => {
    switch (step) {
      case 'type':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>What type of account?</h2>
            <p className={styles.stepDescription}>Select the type of account you want to add</p>

            <div className={styles.typeGrid}>
              {accountTypes.map((type) => (
                <button
                  key={type.value}
                  className={`${styles.typeCard} ${formData.type === type.value ? styles.selected : ''}`}
                  onClick={() => handleTypeSelect(type.value)}
                >
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <span className={styles.typeLabel}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'tracking':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>How do you want to track it?</h2>
            <p className={styles.stepDescription}>Choose how transactions will be recorded</p>

            <div className={styles.trackingOptions}>
              <button
                className={`${styles.trackingCard} ${formData.trackingMode === 'MANUAL' ? styles.selected : ''}`}
                onClick={() => handleTrackingSelect('MANUAL')}
              >
                <div className={styles.trackingHeader}>
                  <span className={styles.trackingIcon}>✏️</span>
                  <span className={styles.trackingTitle}>Manual</span>
                </div>
                <p className={styles.trackingDescription}>
                  Enter transactions yourself. Great for cash accounts or when you want full control.
                </p>
                <ul className={styles.trackingFeatures}>
                  <li>No bank login required</li>
                  <li>Full privacy</li>
                  <li>Add transactions manually</li>
                </ul>
              </button>

              <button
                className={`${styles.trackingCard} ${formData.trackingMode === 'AUTOMATIC' ? styles.selected : ''}`}
                onClick={() => handleTrackingSelect('AUTOMATIC')}
              >
                <div className={styles.trackingHeader}>
                  <span className={styles.trackingIcon}>🔄</span>
                  <span className={styles.trackingTitle}>Automatic</span>
                  <span className={styles.proBadge}>PRO</span>
                </div>
                <p className={styles.trackingDescription}>
                  Connect your bank account to automatically sync transactions.
                </p>
                <ul className={styles.trackingFeatures}>
                  <li>Auto-sync transactions</li>
                  <li>Real-time balance updates</li>
                  <li>Bank-level security</li>
                </ul>
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Account Details</h2>
            <p className={styles.stepDescription}>
              {formData.trackingMode === 'AUTOMATIC'
                ? 'Enter your account details to connect'
                : 'Add information about your account'}
            </p>

            <form className={styles.detailsForm} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Institution/Bank Selection */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bank / Institution</label>
                <div className={styles.bankSelector}>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Search or type bank name..."
                    value={formData.institutionName}
                    onChange={(e) => updateFormData('institutionName', e.target.value)}
                  />
                  <div className={styles.popularBanks}>
                    {popularBanks.slice(0, 6).map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className={`${styles.bankChip} ${formData.institutionName === bank ? styles.selected : ''}`}
                        onClick={() => updateFormData('institutionName', bank)}
                        style={{
                          borderColor: formData.institutionName === bank
                            ? defaultBankColors[bank] || defaultBankColors.default
                            : undefined,
                        }}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Account Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g., Chase Sapphire Preferred"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>

              {/* Last 4 Digits */}
              {(formData.type === 'CREDIT_CARD' || formData.type === 'DEBIT') && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last 4 Digits</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="1234"
                    maxLength={4}
                    value={formData.lastFourDigits}
                    onChange={(e) => updateFormData('lastFourDigits', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              )}

              {/* Current Balance */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {formData.type === 'CREDIT_CARD' ? 'Current Balance' :
                   formData.type === 'LOAN' ? 'Amount Owed' : 'Current Balance'}
                </label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>$</span>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="0.00"
                    value={formData.currentBalance}
                    onChange={(e) => updateFormData('currentBalance', e.target.value.replace(/[^\d.]/g, ''))}
                  />
                </div>
              </div>

              {/* Credit Limit (for credit cards) */}
              {formData.type === 'CREDIT_CARD' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Credit Limit</label>
                  <div className={styles.currencyInput}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="0.00"
                      value={formData.creditLimit}
                      onChange={(e) => updateFormData('creditLimit', e.target.value.replace(/[^\d.]/g, ''))}
                    />
                  </div>
                </div>
              )}

              {/* Interest Rate (for loans/credit cards) */}
              {(formData.type === 'CREDIT_CARD' || formData.type === 'LOAN') && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Interest Rate (APR)</label>
                  <div className={styles.percentInput}>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="0.00"
                      value={formData.interestRate}
                      onChange={(e) => updateFormData('interestRate', e.target.value.replace(/[^\d.]/g, ''))}
                    />
                    <span className={styles.percentSymbol}>%</span>
                  </div>
                </div>
              )}

              {/* Account Details for Automatic Tracking */}
              {formData.trackingMode === 'AUTOMATIC' && (
                <>
                  <div className={styles.securityNote}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Your information is encrypted and secure</span>
                  </div>

                  {(formData.type === 'CHECKING' || formData.type === 'SAVINGS') && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Account Number</label>
                        <input
                          type="password"
                          className={styles.formInput}
                          placeholder="••••••••••"
                          value={formData.accountNumber}
                          onChange={(e) => updateFormData('accountNumber', e.target.value)}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Routing Number</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="9 digits"
                          maxLength={9}
                          value={formData.routingNumber}
                          onChange={(e) => updateFormData('routingNumber', e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {formData.trackingMode === 'AUTOMATIC' ? 'Connect Account' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              {step !== 'type' && (
                <button className={styles.backButton} onClick={handleBack}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              )}
              <div className={styles.stepIndicator}>
                <span className={`${styles.stepDot} ${step === 'type' ? styles.active : styles.completed}`} />
                <span className={`${styles.stepDot} ${step === 'tracking' ? styles.active : step === 'details' ? styles.completed : ''}`} />
                <span className={`${styles.stepDot} ${step === 'details' ? styles.active : ''}`} />
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
