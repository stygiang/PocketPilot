'use client';

import Image from 'next/image';
import styles from './AccountCard.module.scss';

export type AccountType = 'CREDIT_CARD' | 'DEBIT' | 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'LOAN' | 'CASH' | 'OTHER';

export interface AccountCardProps {
  id: string;
  name: string;
  type: AccountType;
  institutionName?: string;
  institutionLogo?: string;
  lastFourDigits?: string;
  currentBalanceCents: number;
  creditLimitCents?: number;
  color?: string;
  onClick?: () => void;
}

// Default bank colors for visual variety
const defaultBankColors: Record<string, string> = {
  'Chase': '#117ACA',
  'Bank of America': '#E31837',
  'Wells Fargo': '#D71E28',
  'Citi': '#003B70',
  'Capital One': '#D03027',
  'American Express': '#006FCF',
  'Discover': '#FF6600',
  'US Bank': '#0C2074',
  'PNC': '#FF6600',
  'TD Bank': '#34A853',
  'Fidelity': '#4A8A2A',
  'Vanguard': '#96151D',
  'Charles Schwab': '#00A0DF',
  'Cash': '#4A4A4A',
  'default': '#2A2A2A',
};

// Get display label for account type
const getTypeLabel = (type: AccountType): string => {
  const labels: Record<AccountType, string> = {
    'CREDIT_CARD': 'Credit',
    'DEBIT': 'Debit',
    'CHECKING': 'Checking',
    'SAVINGS': 'Savings',
    'INVESTMENT': 'Investment',
    'LOAN': 'Loan',
    'CASH': 'Cash',
    'OTHER': 'Account',
  };
  return labels[type];
};

// Format cents to currency string
const formatCurrency = (cents: number): string => {
  const dollars = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);
  return cents < 0 ? `-${formatted}` : formatted;
};

export default function AccountCard({
  name,
  type,
  institutionName,
  institutionLogo,
  lastFourDigits,
  currentBalanceCents,
  creditLimitCents,
  color,
  onClick,
}: AccountCardProps) {
  // Determine card background color
  const cardColor = color || defaultBankColors[institutionName || ''] || defaultBankColors.default;

  // Calculate utilization for credit cards
  const utilization = creditLimitCents && creditLimitCents > 0
    ? Math.round((currentBalanceCents / creditLimitCents) * 100)
    : null;

  return (
    <div
      className={styles.accountCard}
      style={{ background: `linear-gradient(135deg, ${cardColor} 0%, ${adjustColor(cardColor, -30)} 100%)` }}
      onClick={onClick}
    >
      {/* Top row: Bank logo/name */}
      <div className={styles.cardTop}>
        {institutionLogo ? (
          <Image
            src={institutionLogo}
            alt={institutionName || 'Bank'}
            width={40}
            height={24}
            className={styles.bankLogo}
          />
        ) : (
          <span className={styles.bankName}>{institutionName || name}</span>
        )}
      </div>

      {/* Card chip decoration */}
      {(type === 'CREDIT_CARD' || type === 'DEBIT') && (
        <div className={styles.chipContainer}>
          <div className={styles.chip}>
            <div className={styles.chipLine}></div>
            <div className={styles.chipLine}></div>
            <div className={styles.chipLine}></div>
          </div>
        </div>
      )}

      {/* Bottom row: Type and last 4 digits */}
      <div className={styles.cardBottom}>
        <span className={styles.cardType}>{getTypeLabel(type)}</span>
        {lastFourDigits && (
          <span className={styles.lastFour}>
            <span className={styles.dots}>****</span> {lastFourDigits}
          </span>
        )}
      </div>
    </div>
  );
}

// Helper to darken/lighten a hex color
function adjustColor(hex: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));

  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust
  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Export utility functions for use in other components
export { formatCurrency, getTypeLabel, defaultBankColors };
