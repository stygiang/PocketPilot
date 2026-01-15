'use client';

import AccountCard, { AccountCardProps, formatCurrency } from './AccountCard';
import styles from './AccountRow.module.scss';

interface AccountRowProps {
  account: AccountCardProps & {
    previousBalanceCents?: number; // For calculating change %
  };
  onClick?: () => void;
}

export default function AccountRow({ account, onClick }: AccountRowProps) {
  const {
    type,
    currentBalanceCents,
    creditLimitCents,
    previousBalanceCents,
  } = account;

  // Calculate utilization for credit cards
  const utilization = creditLimitCents && creditLimitCents > 0
    ? Math.round((currentBalanceCents / creditLimitCents) * 100)
    : null;

  // Calculate change percentage for debit/checking/savings
  const changePercent = previousBalanceCents && previousBalanceCents !== 0
    ? ((currentBalanceCents - previousBalanceCents) / Math.abs(previousBalanceCents)) * 100
    : null;

  // Determine what to show in the right column based on account type
  const renderRightColumn = () => {
    if (type === 'CREDIT_CARD' && utilization !== null) {
      const utilizationColor = utilization > 80 ? 'danger' : utilization > 50 ? 'warning' : 'success';
      return (
        <div className={styles.utilizationContainer}>
          <div className={styles.utilizationLabel}>Utilized</div>
          <div className={`${styles.utilizationValue} ${styles[utilizationColor]}`}>
            {utilization}%
          </div>
          <div className={styles.utilizationBar}>
            <div
              className={`${styles.utilizationFill} ${styles[utilizationColor]}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>
      );
    }

    if ((type === 'DEBIT' || type === 'CHECKING' || type === 'SAVINGS') && changePercent !== null) {
      const isPositive = changePercent >= 0;
      return (
        <div className={styles.changeContainer}>
          <div className={styles.changeLabel}>This month</div>
          <div className={`${styles.changeValue} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </div>
        </div>
      );
    }

    if (type === 'INVESTMENT') {
      const isPositive = changePercent !== null ? changePercent >= 0 : true;
      return (
        <div className={styles.changeContainer}>
          <div className={styles.changeLabel}>All time</div>
          <div className={`${styles.changeValue} ${isPositive ? styles.positive : styles.negative}`}>
            {changePercent !== null ? (
              <>
                {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
              </>
            ) : (
              '--'
            )}
          </div>
        </div>
      );
    }

    if (type === 'LOAN') {
      return (
        <div className={styles.loanContainer}>
          <div className={styles.changeLabel}>Remaining</div>
          <div className={styles.loanValue}>
            {formatCurrency(currentBalanceCents)}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.accountRow} onClick={onClick}>
      {/* Left: Account Card Preview */}
      <div className={styles.cardColumn}>
        <AccountCard {...account} />
      </div>

      {/* Middle: Balance */}
      <div className={styles.balanceColumn}>
        <div className={styles.balanceLabel}>
          {type === 'CREDIT_CARD' ? 'Balance' : type === 'LOAN' ? 'Owed' : 'Available'}
        </div>
        <div className={`${styles.balanceValue} ${currentBalanceCents < 0 ? styles.negative : ''}`}>
          {formatCurrency(currentBalanceCents)}
        </div>
        {creditLimitCents && type === 'CREDIT_CARD' && (
          <div className={styles.creditLimit}>
            of {formatCurrency(creditLimitCents)} limit
          </div>
        )}
      </div>

      {/* Right: Utilization/Change */}
      <div className={styles.metricsColumn}>
        {renderRightColumn()}
      </div>

      {/* Chevron */}
      <div className={styles.chevronColumn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}
