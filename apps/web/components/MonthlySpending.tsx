'use client';

import Link from 'next/link';
import styles from './MonthlySpending.module.scss';

export default function MonthlySpending() {
  // Mock data - replace with real data from API
  const spentAmount = 1000;
  const lastMonthSpent = 800;
  const underBudget = 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Monthly spending</h2>
        <Link href="/transactions" className={styles.link}>
          Transactions →
        </Link>
      </div>

      <div className={styles.amounts}>
        <div className={styles.mainAmount}>
          <span className={styles.currency}>$</span>
          <span className={styles.value}>{spentAmount.toLocaleString()}</span>
          <span className={styles.label}>spent</span>
        </div>
        <div className={styles.subAmount}>
          <span className={styles.subLabel}>
            ${lastMonthSpent} spent last month
          </span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {/* Simplified SVG chart */}
        <svg className={styles.chart} viewBox="0 0 400 150" preserveAspectRatio="none">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Chart line */}
          <path
            d="M 0 100 Q 50 90 100 80 T 200 60 Q 250 55 300 50 T 400 30"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          <circle cx="100" cy="80" r="4" fill="#f97316" />
          <circle cx="200" cy="60" r="4" fill="#fbbf24" />
          <circle cx="300" cy="50" r="4" fill="#fbbf24" />
          <circle cx="400" cy="30" r="6" fill="#22c55e" />

          {/* Under budget indicator */}
          <g transform="translate(380, 20)">
            <rect x="-40" y="-12" width="80" height="24" rx="12" fill="#22c55e" />
            <text x="0" y="4" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
              ${underBudget} under
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
