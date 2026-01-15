'use client';

import Link from 'next/link';
import styles from './NetWorth.module.scss';

export default function NetWorth() {
  // Mock data - replace with real data
  const assets = 100000;
  const assetsChange = 32;
  const debts = 5000;
  const debtsChange = -16;

  const assetsPercentage = 95;
  const debtsPercentage = 5;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Net worth</h2>
        <Link href="/accounts" className={styles.link}>
          Accounts →
        </Link>
      </div>

      <div className={styles.summary}>
        <div className={styles.asset}>
          <div className={styles.indicator}>●</div>
          <span className={styles.label}>Assets</span>
        </div>
        <div className={styles.debt}>
          <div className={styles.indicator}>●</div>
          <span className={styles.label}>Debts</span>
        </div>
      </div>

      <div className={styles.amounts}>
        <div className={styles.amountRow}>
          <div className={styles.amount}>
            <span className={styles.currency}>$</span>
            <span className={styles.value}>{assets.toLocaleString()}</span>
          </div>
          <div className={`${styles.change} ${styles.changePositive}`}>
            ⬆ {assetsChange}%
          </div>
        </div>

        <div className={styles.amountRow}>
          <div className={styles.amount}>
            <span className={styles.currency}>$</span>
            <span className={styles.value}>{debts.toLocaleString()}</span>
          </div>
          <div className={`${styles.change} ${styles.changeNegative}`}>
            ⬇ {Math.abs(debtsChange)}%
          </div>
        </div>
      </div>

      <div className={styles.chart}>
        <div className={styles.progressBar}>
          <div className={styles.assetsBar} style={{ width: `${assetsPercentage}%` }} />
          <div className={styles.debtsBar} style={{ width: `${debtsPercentage}%` }} />
        </div>
      </div>

      <div className={styles.timeline}>
        <button className={styles.timelineBtn}>1W</button>
        <button className={styles.timelineBtn}>1M</button>
        <button className={styles.timelineBtn}>3M</button>
        <button className={styles.timelineBtn}>YTD</button>
        <button className={styles.timelineBtn}>1Y</button>
        <button className={`${styles.timelineBtn} ${styles.timelineBtnActive}`}>
          ALL
        </button>
      </div>
    </div>
  );
}
