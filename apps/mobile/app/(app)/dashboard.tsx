import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { colors, spacing, typography, borderRadius } from '../../styles/tokens';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  icon: string;
};

// Copilot-inspired sample data
const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Uber', amount: -20.89, category: 'UBER', date: new Date().toISOString(), icon: '🚗' },
  { id: '2', description: 'Panera', amount: -15.30, category: 'RESTAURANTS', date: new Date().toISOString(), icon: '🍽️' },
  { id: '3', description: 'Apple TV+', amount: -11.00, category: 'STREAMING', date: new Date(Date.now() - 86400000).toISOString(), icon: '📺' },
  { id: '4', description: 'Rock Climbing', amount: -100.00, category: 'ENTERTAINMENT', date: new Date(Date.now() - 86400000).toISOString(), icon: '🧗' },
  { id: '5', description: 'Salary', amount: 3000.00, category: 'INCOME', date: new Date(Date.now() - 172800000).toISOString(), icon: '💰' },
];

const formatCurrency = (amount: number) => {
  const formatted = Math.abs(amount).toFixed(2);
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
};

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    checkDemoMode();
  }, []);

  const checkDemoMode = async () => {
    const demoFlag = await SecureStore.getItemAsync('is_demo');
    setIsDemo(demoFlag === 'true');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const safeToday = 120.50;
  const safePerDay = 42.86;
  const totalIncome = SAMPLE_TRANSACTIONS.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(SAMPLE_TRANSACTIONS.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" />

      {/* Demo Mode Banner (like Copilot) - Outside rounded container */}
      {isDemo && (
        <View style={styles.demoBanner}>
          <View style={styles.demoBannerSpacer} />
          <Text style={styles.demoBannerText}>You're in demo mode</Text>
          <Pressable style={styles.demoBannerCloseButton}>
            <Text style={styles.demoBannerClose}>✕</Text>
          </Pressable>
        </View>
      )}

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandPrimary} />}
        >
        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Safe to Spend Today</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(safeToday)}</Text>
          <Text style={styles.balanceSubtext}>{formatCurrency(safePerDay)} per day until next paycheck</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INCOME</Text>
            <Text style={styles.statValue}>{formatCurrency(totalIncome)}</Text>
            <Text style={styles.statChange}>This month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EXPENSES</Text>
            <Text style={styles.statValue}>{formatCurrency(totalExpenses)}</Text>
            <Text style={styles.statChange}>This month</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          {SAMPLE_TRANSACTIONS.map((transaction) => (
            <Pressable key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.transactionIcon}>{transaction.icon}</Text>
                </View>
                <View>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.amount > 0 ? styles.incomeAmount : styles.expenseAmount
              ]}>
                {formatCurrency(transaction.amount)}
              </Text>
            </Pressable>
          ))}
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  demoBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[6],
  },
  demoBannerSpacer: {
    width: 24,
  },
  demoBannerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    textAlign: 'center',
  },
  demoBannerCloseButton: {
    width: 24,
    alignItems: 'flex-end',
  },
  demoBannerClose: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing[1],
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  balanceCard: {
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    marginBottom: spacing[4],
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    opacity: 0.9,
    marginBottom: spacing[2],
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  balanceSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  statChange: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.brandPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIcon: {
    fontSize: 20,
  },
  transactionDescription: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  incomeAmount: {
    color: '#10b981',
  },
  expenseAmount: {
    color: colors.textPrimary,
  },
});
