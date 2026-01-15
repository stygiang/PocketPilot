import SideNavigation from '@/components/SideNavigation';
import MonthlySpending from '@/components/MonthlySpending';
import NetWorth from '@/components/NetWorth';
import TransactionsToReview from '@/components/TransactionsToReview';
import TopCategories from '@/components/TopCategories';
import NextRecurrings from '@/components/NextRecurrings';
import styles from './page.module.scss';

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <SideNavigation />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </header>

        <div className={styles.grid}>
          {/* Monthly Spending Card */}
          <div className={styles.cardLarge}>
            <MonthlySpending />
          </div>

          {/* Net Worth Card */}
          <div className={styles.cardMedium}>
            <NetWorth />
          </div>

          {/* Transactions to Review */}
          <div className={styles.cardLarge}>
            <TransactionsToReview />
          </div>

          {/* Top Categories */}
          <div className={styles.cardMedium}>
            <TopCategories />
          </div>

          {/* Next Two Weeks Recurrings */}
          <div className={styles.cardFull}>
            <NextRecurrings />
          </div>
        </div>
      </main>
    </div>
  );
}
