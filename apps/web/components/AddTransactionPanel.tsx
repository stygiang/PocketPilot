'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from './AddTransactionPanel.module.scss';

interface Bank {
  id: string;
  name: string;
  lastFour: string;
  color: string;
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

interface AddTransactionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: NewTransaction) => void;
}

const categories = [
  { name: 'SUBSCRIPTIONS', color: '#3b82f6' },
  { name: 'GROCERIES', color: '#22c55e' },
  { name: 'TRANSPORTATION', color: '#f59e0b' },
  { name: 'ENTERTAINMENT', color: '#a855f7' },
  { name: 'RESTAURANTS', color: '#f97316' },
  { name: 'SHOPPING', color: '#ec4899' },
  { name: 'BILLS', color: '#ef4444' },
  { name: 'INCOME', color: '#10b981' },
];

const banks: Bank[] = [
  { id: 'chase', name: 'Chase', lastFour: '4521', color: '#0a4abf' },
  { id: 'bofa', name: 'Bank of America', lastFour: '8832', color: '#c41230' },
  { id: 'wells', name: 'Wells Fargo', lastFour: '1199', color: '#d71e28' },
  { id: 'amex', name: 'Amex', lastFour: '3001', color: '#006fcf' },
];

const getDefaultDate = () => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${day}, ${month} ${date}, ${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export default function AddTransactionPanel({
  isOpen,
  onClose,
  onAdd,
}: AddTransactionPanelProps) {
  const [formData, setFormData] = useState<NewTransaction>({
    name: '',
    amount: '',
    category: 'GROCERIES',
    categoryColor: '#22c55e',
    date: getDefaultDate(),
    type: 'EXPENSE',
    bankId: null,
  });
  const [expandedSection, setExpandedSection] = useState<'category' | 'bank' | null>(null);

  const handleSubmit = () => {
    if (formData.name && formData.amount) {
      onAdd(formData);
      // Reset form
      setFormData({
        name: '',
        amount: '',
        category: 'GROCERIES',
        categoryColor: '#22c55e',
        date: getDefaultDate(),
        type: 'EXPENSE',
        bankId: null,
      });
      setExpandedSection(null);
      onClose();
    }
  };

  const handleCategoryChange = (categoryName: string, categoryColor: string) => {
    setFormData({
      ...formData,
      category: categoryName,
      categoryColor: categoryColor,
    });
    setExpandedSection(null);
  };

  const handleBankChange = (bankId: string | null) => {
    setFormData({
      ...formData,
      bankId: bankId,
    });
    setExpandedSection(null);
  };

  const handleTypeChange = (type: 'EXPENSE' | 'INCOME') => {
    setFormData({
      ...formData,
      type: type,
    });
  };

  const currentBank = formData.bankId ? banks.find(b => b.id === formData.bankId) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.panel}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <motion.div
            className={styles.panelContent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Add Transaction</h2>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.form}>
              {/* Transaction Name */}
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Coffee Shop"
                />
              </div>

              {/* Amount */}
              <div className={styles.field}>
                <label className={styles.label}>Amount</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="$0.00"
                />
              </div>

              {/* Date */}
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Date"
                />
              </div>

              {/* Type Toggle */}
              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <div className={styles.typeToggle}>
                  <motion.button
                    className={`${styles.typeButton} ${
                      formData.type === 'EXPENSE' ? styles.typeButtonActive : ''
                    }`}
                    onClick={() => handleTypeChange('EXPENSE')}
                    whileTap={{ scale: 0.95 }}
                  >
                    Expense
                  </motion.button>
                  <motion.button
                    className={`${styles.typeButton} ${
                      formData.type === 'INCOME' ? styles.typeButtonActive : ''
                    }`}
                    onClick={() => handleTypeChange('INCOME')}
                    whileTap={{ scale: 0.95 }}
                  >
                    Income
                  </motion.button>
                </div>
              </div>

              {/* Category Selection */}
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <div className={styles.categorySection}>
                  {expandedSection !== 'category' ? (
                    <motion.button
                      className={styles.categoryTag}
                      style={{ backgroundColor: formData.categoryColor }}
                      onClick={() => setExpandedSection('category')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {formData.category}
                    </motion.button>
                  ) : (
                    <motion.div
                      className={styles.categoryGrid}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.name}
                          className={`${styles.categoryTag} ${
                            formData.category === cat.name ? styles.categoryTagActive : ''
                          }`}
                          style={{ backgroundColor: cat.color }}
                          onClick={() => handleCategoryChange(cat.name, cat.color)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {cat.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bank Selection */}
              <div className={styles.field}>
                <label className={styles.label}>Bank Account</label>
                <div className={styles.bankSection}>
                  {expandedSection !== 'bank' ? (
                    currentBank ? (
                      <motion.button
                        className={styles.bankCard}
                        style={{ backgroundColor: currentBank.color }}
                        onClick={() => setExpandedSection('bank')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={styles.bankName}>{currentBank.name}</span>
                        <span className={styles.bankNumber}>•••• {currentBank.lastFour}</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        className={styles.bankCardEmpty}
                        onClick={() => setExpandedSection('bank')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={styles.bankEmptyText}>Select a card</span>
                      </motion.button>
                    )
                  ) : (
                    <motion.div
                      className={styles.bankGrid}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        className={`${styles.bankCardEmpty} ${styles.bankCardOption}`}
                        onClick={() => handleBankChange(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={styles.bankEmptyText}>No card</span>
                      </motion.button>
                      {banks.map((bank) => (
                        <motion.button
                          key={bank.id}
                          className={`${styles.bankCard} ${
                            formData.bankId === bank.id ? styles.bankCardActive : ''
                          }`}
                          style={{ backgroundColor: bank.color }}
                          onClick={() => handleBankChange(bank.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={styles.bankName}>{bank.name}</span>
                          <span className={styles.bankNumber}>•••• {bank.lastFour}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <motion.button
                className={styles.cancelButton}
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={styles.addButton}
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!formData.name || !formData.amount}
              >
                Add Transaction
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
