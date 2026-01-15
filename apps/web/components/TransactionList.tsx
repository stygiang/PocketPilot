'use client';

import { useState, useEffect } from 'react';
import styles from './TransactionList.module.scss';
import TransactionModal from './TransactionModal';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  category: string;
  categoryColor: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
  bankId?: string | null;
}

interface NewTransaction {
  name: string;
  amount: string;
  category: string;
  categoryColor: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
  bankId: string | null;
}

interface TransactionListProps {
  newTransactions?: NewTransaction[];
}

// Extended mock data for full transactions page
const allTransactions: Transaction[] = [
  // Today (Wednesday)
  {
    id: '1',
    name: 'Apple Music',
    amount: '$10.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    date: 'Wednesday, Jan 15, 2:45 PM',
    type: 'EXPENSE',
    bankId: 'chase',
  },
  {
    id: '2',
    name: 'Park Slope Food Coop',
    amount: '$32.85',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    date: 'Wednesday, Jan 15, 11:20 AM',
    type: 'EXPENSE',
    bankId: 'bofa',
  },
  {
    id: '3',
    name: 'Lyft',
    amount: '$21.35',
    category: 'TRANSPORTATION',
    categoryColor: '#f59e0b',
    date: 'Wednesday, Jan 15, 9:15 AM',
    type: 'EXPENSE',
    bankId: null,
  },
  // Yesterday (Tuesday)
  {
    id: '4',
    name: 'Film Noir Cinemas',
    amount: '$17.99',
    category: 'ENTERTAINMENT',
    categoryColor: '#a855f7',
    date: 'Tuesday, Jan 14, 7:30 PM',
    type: 'EXPENSE',
  },
  {
    id: '5',
    name: "Eden's Salads",
    amount: '$15.12',
    category: 'RESTAURANTS',
    categoryColor: '#f97316',
    date: 'Tuesday, Jan 14, 12:45 PM',
    type: 'EXPENSE',
  },
  {
    id: '6',
    name: 'Target',
    amount: '$56.40',
    category: 'SHOPPING',
    categoryColor: '#ec4899',
    date: 'Tuesday, Jan 14, 10:00 AM',
    type: 'EXPENSE',
  },
  {
    id: '7',
    name: 'Paycheck Deposit',
    amount: '+$3,500.00',
    category: 'INCOME',
    categoryColor: '#10b981',
    date: 'Tuesday, Jan 14, 8:00 AM',
    type: 'INCOME',
  },
  // Earlier this week
  {
    id: '8',
    name: 'Whole Foods',
    amount: '$87.32',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    date: 'Monday, Jan 13, 3:15 PM',
    type: 'EXPENSE',
  },
  {
    id: '9',
    name: 'Netflix',
    amount: '$15.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    date: 'Monday, Jan 13, 9:00 AM',
    type: 'EXPENSE',
  },
  {
    id: '10',
    name: 'Coffee Shop',
    amount: '$5.75',
    category: 'RESTAURANTS',
    categoryColor: '#f97316',
    date: 'Sunday, Jan 12, 8:30 AM',
    type: 'EXPENSE',
  },
  {
    id: '11',
    name: 'Gas Station',
    amount: '$45.00',
    category: 'TRANSPORTATION',
    categoryColor: '#f59e0b',
    date: 'Saturday, Jan 11, 5:45 PM',
    type: 'EXPENSE',
  },
  {
    id: '12',
    name: 'Amazon',
    amount: '$123.45',
    category: 'SHOPPING',
    categoryColor: '#ec4899',
    date: 'Saturday, Jan 11, 2:20 PM',
    type: 'EXPENSE',
  },
  // Previous months - repeat merchants for side panel demo
  {
    id: '13',
    name: 'Apple Music',
    amount: '$10.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    date: 'Friday, Dec 15, 2:45 PM',
    type: 'EXPENSE',
    bankId: 'chase',
  },
  {
    id: '14',
    name: 'Apple Music',
    amount: '$10.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    date: 'Wednesday, Nov 15, 2:45 PM',
    type: 'EXPENSE',
    bankId: 'chase',
  },
  {
    id: '15',
    name: 'Netflix',
    amount: '$15.99',
    category: 'SUBSCRIPTIONS',
    categoryColor: '#3b82f6',
    date: 'Friday, Dec 13, 9:00 AM',
    type: 'EXPENSE',
  },
  {
    id: '16',
    name: 'Whole Foods',
    amount: '$65.20',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    date: 'Thursday, Jan 9, 4:30 PM',
    type: 'EXPENSE',
  },
  {
    id: '17',
    name: 'Whole Foods',
    amount: '$92.15',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    date: 'Sunday, Jan 5, 11:00 AM',
    type: 'EXPENSE',
  },
];

// Group transactions by date
const groupByDate = (transactions: Transaction[]) => {
  const groups: { [key: string]: Transaction[] } = {};

  transactions.forEach((transaction) => {
    const dateKey = transaction.date.split(',')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
  });

  return groups;
};

export default function TransactionList({ newTransactions = [] }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions);

  // Add new transactions when they come in from the parent
  useEffect(() => {
    if (newTransactions.length > 0) {
      const newTxns: Transaction[] = newTransactions.map((t, i) => ({
        ...t,
        id: `new-${Date.now()}-${i}`,
      }));
      setTransactions((prev) => {
        // Only add transactions that aren't already in the list
        const existingIds = new Set(prev.map((t) => t.id));
        const toAdd = newTxns.filter((t) => !existingIds.has(t.id));
        return [...toAdd, ...prev];
      });
    }
  }, [newTransactions]);

  const groupedTransactions = groupByDate(transactions);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.continuousCard}>
        <div className={styles.transactionGroups}>
          {Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date} className={styles.transactionGroup}>
              <h3 className={styles.dateHeader}>{date}</h3>
              <div className={styles.transactionList}>
                {txns.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={styles.transaction}
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className={styles.transactionName}>{transaction.name}</div>
                    <div
                      className={styles.transactionCategory}
                      style={{ backgroundColor: transaction.categoryColor }}
                    >
                      {transaction.category}
                    </div>
                    <div
                      className={`${styles.transactionAmount} ${
                        transaction.type === 'INCOME' ? styles.transactionAmountPositive : ''
                      }`}
                    >
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        allTransactions={transactions}
        onSelectTransaction={(t) => setSelectedTransaction(t)}
      />
    </div>
  );
}
