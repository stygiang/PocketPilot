'use client';

import Link from 'next/link';
import styles from './NextRecurrings.module.scss';

interface Recurring {
  id: string;
  name: string;
  amount: string;
  dueDate: string;
  status: 'upcoming' | 'due-soon' | 'overdue';
}

const recurrings: Recurring[] = [
  {
    id: '1',
    name: 'Rent',
    amount: '$1,200',
    dueDate: 'Jan 1',
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Internet',
    amount: '$60',
    dueDate: 'Jan 10',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Electric',
    amount: '$85',
    dueDate: 'Jan 15',
    status: 'due-soon',
  },
  {
    id: '4',
    name: 'Phone',
    amount: '$45',
    dueDate: 'Jan 20',
    status: 'upcoming',
  },
];

export default function NextRecurrings() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Next two weeks</h2>
        <Link href="/recurrings" className={styles.link}>
          Recurrings →
        </Link>
      </div>

      <div className={styles.recurringList}>
        {recurrings.map((recurring) => (
          <div
            key={recurring.id}
            className={`${styles.recurring} ${
              recurring.status === 'due-soon' ? styles.recurringDueSoon : ''
            }`}
          >
            <div className={styles.recurringInfo}>
              <div className={styles.recurringName}>{recurring.name}</div>
              <div className={styles.recurringDate}>{recurring.dueDate}</div>
            </div>
            <div className={styles.recurringAmount}>{recurring.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
