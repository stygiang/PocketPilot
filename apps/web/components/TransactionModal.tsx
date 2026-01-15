'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './TransactionModal.module.scss';

interface Bank {
  id: string;
  name: string;
  lastFour: string;
  color: string;
}

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

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  allTransactions?: Transaction[];
  onSelectTransaction?: (transaction: Transaction) => void;
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

export default function TransactionModal({
  transaction,
  isOpen,
  onClose,
  onSave,
  onDelete,
  allTransactions = [],
  onSelectTransaction,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction | null>(null);
  const [expandedSection, setExpandedSection] = useState<'category' | 'bank' | null>(null);

  // Update form data when transaction prop changes
  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
      setExpandedSection(null);
    }
  }, [transaction]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (formData) {
      onDelete(formData.id);
      onClose();
    }
  };

  const handleCategoryChange = (categoryName: string, categoryColor: string) => {
    if (formData) {
      setFormData({
        ...formData,
        category: categoryName,
        categoryColor: categoryColor,
      });
      setExpandedSection(null);
    }
  };

  const handleTypeChange = (type: 'EXPENSE' | 'INCOME') => {
    if (formData) {
      setFormData({
        ...formData,
        type: type,
      });
    }
  };

  const handleBankChange = (bankId: string | null) => {
    if (formData) {
      setFormData({
        ...formData,
        bankId: bankId,
      });
      setExpandedSection(null);
    }
  };

  const currentBank = formData?.bankId ? banks.find(b => b.id === formData.bankId) : null;

  // Get other transactions from the same merchant (excluding current transaction)
  const otherMerchantTransactions = allTransactions.filter(
    (t) => t.name === formData?.name && t.id !== formData?.id
  );

  const handleSelectOtherTransaction = (t: Transaction) => {
    if (onSelectTransaction) {
      onSelectTransaction(t);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && formData && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Wrapper for centering */}
          <div className={styles.modalWrapper}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
            <div className={styles.header}>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            {/* Centered Date, Transaction Name & Amount - Editable */}
            <div className={styles.nameSection}>
              <input
                type="text"
                className={styles.dateInput}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Date"
              />
              <input
                type="text"
                className={styles.nameInput}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Transaction name"
              />
              <input
                type="text"
                className={styles.amountInput}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="$0.00"
              />
            </div>

            <div className={styles.content}>
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
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
                        <span className={styles.bankEmptyText}>No card attached</span>
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
                className={styles.deleteButton}
                onClick={handleDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete Transaction
              </motion.button>
              <div className={styles.footerActions}>
                <motion.button
                  className={styles.cancelButton}
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={styles.saveButton}
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
            </motion.div>

            {/* Side Panel - Other Transactions by Same Merchant */}
            {otherMerchantTransactions.length > 0 && (
              <motion.div
                className={styles.sidePanel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
              >
                <div className={styles.sidePanelHeader}>
                  <h3 className={styles.sidePanelTitle}>Other {formData.name} Transactions</h3>
                  <span className={styles.sidePanelCount}>{otherMerchantTransactions.length}</span>
                </div>
                <div className={styles.sidePanelList}>
                  {otherMerchantTransactions.map((t) => (
                    <motion.button
                      key={t.id}
                      className={styles.sidePanelItem}
                      onClick={() => handleSelectOtherTransaction(t)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={styles.sidePanelItemDate}>{t.date.split(',').slice(0, 2).join(',')}</span>
                      <span className={styles.sidePanelItemAmount}>{t.amount}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
