'use client';

import { useState } from 'react';
import SideNavigation from '@/components/SideNavigation';
import AccountRow from '@/components/AccountRow';
import AddAccountModal from '@/components/AddAccountModal';
import styles from './page.module.scss';
import { AccountType } from '@/components/AccountCard';

// Mock data - replace with API calls
const mockAccounts = {
  creditCards: [
    {
      id: '1',
      name: 'Chase Sapphire Preferred',
      type: 'CREDIT_CARD' as AccountType,
      institutionName: 'Chase',
      lastFourDigits: '4521',
      currentBalanceCents: 245000, // $2,450.00
      creditLimitCents: 1000000, // $10,000.00
      previousBalanceCents: 180000,
    },
    {
      id: '2',
      name: 'American Express Gold',
      type: 'CREDIT_CARD' as AccountType,
      institutionName: 'American Express',
      lastFourDigits: '1008',
      currentBalanceCents: 89500, // $895.00
      creditLimitCents: 500000, // $5,000.00
      previousBalanceCents: 120000,
    },
  ],
  debitCards: [
    {
      id: '3',
      name: 'Chase Checking',
      type: 'DEBIT' as AccountType,
      institutionName: 'Chase',
      lastFourDigits: '7890',
      currentBalanceCents: 542300, // $5,423.00
      previousBalanceCents: 480000,
    },
    {
      id: '4',
      name: 'Bank of America Checking',
      type: 'CHECKING' as AccountType,
      institutionName: 'Bank of America',
      lastFourDigits: '3456',
      currentBalanceCents: 128900, // $1,289.00
      previousBalanceCents: 150000,
    },
  ],
  savings: [
    {
      id: '5',
      name: 'High Yield Savings',
      type: 'SAVINGS' as AccountType,
      institutionName: 'Capital One',
      lastFourDigits: '9012',
      currentBalanceCents: 1250000, // $12,500.00
      previousBalanceCents: 1100000,
    },
  ],
  investments: [
    {
      id: '6',
      name: 'Fidelity Brokerage',
      type: 'INVESTMENT' as AccountType,
      institutionName: 'Fidelity',
      lastFourDigits: '5678',
      currentBalanceCents: 4523400, // $45,234.00
      previousBalanceCents: 4000000,
    },
    {
      id: '7',
      name: 'Vanguard 401k',
      type: 'INVESTMENT' as AccountType,
      institutionName: 'Vanguard',
      lastFourDigits: '2345',
      currentBalanceCents: 8745600, // $87,456.00
      previousBalanceCents: 7500000,
    },
  ],
  loans: [
    {
      id: '8',
      name: 'Auto Loan',
      type: 'LOAN' as AccountType,
      institutionName: 'Wells Fargo',
      lastFourDigits: '6789',
      currentBalanceCents: 1523400, // $15,234.00 remaining
      previousBalanceCents: 1800000,
    },
  ],
  other: [
    {
      id: '9',
      name: 'Cash Wallet',
      type: 'CASH' as AccountType,
      institutionName: 'Cash',
      currentBalanceCents: 35000, // $350.00
      previousBalanceCents: 40000,
    },
  ],
};

// Calculate totals
const calculateTotal = (accounts: typeof mockAccounts.creditCards) => {
  return accounts.reduce((sum, acc) => sum + acc.currentBalanceCents, 0);
};

const formatCurrency = (cents: number): string => {
  const dollars = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);
  return cents < 0 ? `-${formatted}` : formatted;
};

interface AccountSectionProps {
  title: string;
  accounts: typeof mockAccounts.creditCards;
  totalLabel: string;
  emptyMessage: string;
  onAddClick: () => void;
}

function AccountSection({ title, accounts, totalLabel, emptyMessage, onAddClick }: AccountSectionProps) {
  const total = calculateTotal(accounts);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <span className={styles.accountCount}>{accounts.length}</span>
        </div>
        <div className={styles.sectionTotal}>
          <span className={styles.totalLabel}>{totalLabel}</span>
          <span className={styles.totalValue}>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className={styles.accountsList}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onClick={() => console.log('View account:', account.id)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>{emptyMessage}</p>
            <button className={styles.addButton} onClick={onAddClick}>
              + Add {title.slice(0, -1)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addAccountType, setAddAccountType] = useState<AccountType | null>(null);

  const openAddModal = (type?: AccountType) => {
    setAddAccountType(type || null);
    setIsAddModalOpen(true);
  };

  // Calculate net worth
  const totalAssets =
    calculateTotal(mockAccounts.debitCards) +
    calculateTotal(mockAccounts.savings) +
    calculateTotal(mockAccounts.investments) +
    calculateTotal(mockAccounts.other);

  const totalLiabilities =
    calculateTotal(mockAccounts.creditCards) +
    calculateTotal(mockAccounts.loans);

  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className={styles.pageContainer}>
      <SideNavigation />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Accounts</h1>
            <p className={styles.subtitle}>Manage your financial accounts</p>
          </div>
          <button className={styles.addAccountButton} onClick={() => openAddModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Account
          </button>
        </header>

        {/* Net Worth Summary */}
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Assets</span>
            <span className={styles.summaryValue}>{formatCurrency(totalAssets)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Liabilities</span>
            <span className={`${styles.summaryValue} ${styles.negative}`}>
              {formatCurrency(totalLiabilities)}
            </span>
          </div>
          <div className={`${styles.summaryCard} ${styles.netWorthCard}`}>
            <span className={styles.summaryLabel}>Net Worth</span>
            <span className={`${styles.summaryValue} ${netWorth >= 0 ? styles.positive : styles.negative}`}>
              {formatCurrency(netWorth)}
            </span>
          </div>
        </div>

        {/* Account Sections */}
        <div className={styles.sectionsContainer}>
          <AccountSection
            title="Credit Cards"
            accounts={mockAccounts.creditCards}
            totalLabel="Total Balance"
            emptyMessage="No credit cards added yet"
            onAddClick={() => openAddModal('CREDIT_CARD')}
          />

          <AccountSection
            title="Bank Accounts"
            accounts={[...mockAccounts.debitCards, ...mockAccounts.savings]}
            totalLabel="Total Balance"
            emptyMessage="No bank accounts added yet"
            onAddClick={() => openAddModal('CHECKING')}
          />

          <AccountSection
            title="Investments"
            accounts={mockAccounts.investments}
            totalLabel="Total Value"
            emptyMessage="No investment accounts added yet"
            onAddClick={() => openAddModal('INVESTMENT')}
          />

          <AccountSection
            title="Loans"
            accounts={mockAccounts.loans}
            totalLabel="Total Owed"
            emptyMessage="No loans added yet"
            onAddClick={() => openAddModal('LOAN')}
          />

          <AccountSection
            title="Other"
            accounts={mockAccounts.other}
            totalLabel="Total Balance"
            emptyMessage="No other accounts added yet"
            onAddClick={() => openAddModal('CASH')}
          />
        </div>
      </main>

      {isAddModalOpen && (
        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultType={addAccountType}
        />
      )}
    </div>
  );
}
