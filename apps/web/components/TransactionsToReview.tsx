'use client';

import Link from 'next/link';
import styles from './TransactionsToReview.module.scss';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  category: string;
  categoryColor: string;
  icon: string;
  date: 'TODAY' | 'YESTERDAY';
}

const transactions: Transaction[] = [
  {
    id: '1',
    name: 'Apple Music',
    amount: '$10.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    icon: '🎵',
    date: 'TODAY',
  },
  {
    id: '2',
    name: 'Park Slope Food Coop',
    amount: '$32.85',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    icon: '🛒',
    date: 'TODAY',
  },
  {
    id: '3',
    name: 'Lyft',
    amount: '$21.35',
    category: 'TRANSPORTATION',
    categoryColor: '#f59e0b',
    icon: '🚗',
    date: 'TODAY',
  },
  {
    id: '4',
    name: 'Film Noir Cinemas',
    amount: '$17.99',
    category: 'ENTERTAINMENT',
    categoryColor: '#a855f7',
    icon: '🎬',
    date: 'YESTERDAY',
  },
  {
    id: '5',
    name: "Eden's Salads",
    amount: '$15.12',
    category: 'RESTAURANTS',
    categoryColor: '#f97316',
    icon: '🍽️',
    date: 'YESTERDAY',
  },
  {
    id: '6',
    name: 'Target',
    amount: '$56.40',
    category: 'SHOPS',
    categoryColor: '#ec4899',
    icon: '🛍️',
    date: 'YESTERDAY',
  },
];

export default function TransactionsToReview() {
  const todayTransactions = transactions.filter((t) => t.date === 'TODAY');
  const yesterdayTransactions = transactions.filter((t) => t.date === 'YESTERDAY');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transactions to review</h2>
        <Link href="/transactions" className={styles.link}>
          View all →
        </Link>
      </div>

      {/* Today */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>TODAY</h3>
        <div className={styles.transactionList}>
          {todayTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <div className={styles.transactionName}>{transaction.name}</div>
              <div
                className={styles.transactionCategory}
                style={{ backgroundColor: transaction.categoryColor }}
              >
                {transaction.category}
              </div>
              <div className={styles.transactionAmount}>{transaction.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Yesterday */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>YESTERDAY</h3>
        <div className={styles.transactionList}>
          {yesterdayTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <div className={styles.transactionName}>{transaction.name}</div>
              <div
                className={styles.transactionCategory}
                style={{ backgroundColor: transaction.categoryColor }}
              >
                {transaction.category}
              </div>
              <div className={styles.transactionAmount}>{transaction.amount}</div>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.markReviewed}>
        <span className={styles.checkmark}>✓</span>
        Mark 6 as reviewed
      </button>
    </div>
  );
}
