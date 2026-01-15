'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SideNavigation from '@/components/SideNavigation';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import AddTransactionPanel from '@/components/AddTransactionPanel';
import styles from './page.module.scss';

interface NewTransaction {
  name: string;
  amount: string;
  category: string;
  categoryColor: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
  bankId: string | null;
}

export default function TransactionsPage() {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [newTransactions, setNewTransactions] = useState<NewTransaction[]>([]);

  const handleAddTransaction = (transaction: NewTransaction) => {
    setNewTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <div className={styles.transactionsContainer}>
      <SideNavigation />

      <div className={styles.pageWrapper}>
        <motion.main
          className={styles.mainContent}
          animate={{
            marginRight: isAddPanelOpen ? 0 : 0,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <header className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Transactions</h1>
              <p className={styles.subtitle}>Track and manage all your transactions</p>
            </div>
            <motion.button
              className={styles.addButton}
              onClick={() => setIsAddPanelOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.addIcon}>+</span>
              Add Transaction
            </motion.button>
          </header>

          <TransactionFilters />
          <TransactionList newTransactions={newTransactions} />
        </motion.main>

        <AddTransactionPanel
          isOpen={isAddPanelOpen}
          onClose={() => setIsAddPanelOpen(false)}
          onAdd={handleAddTransaction}
        />
      </div>
    </div>
  );
}
