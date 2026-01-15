import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  TextInput,
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

// Copilot-inspired transaction data
const ALL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Uber', amount: -20.89, category: 'UBER', date: new Date().toISOString(), icon: '🚗' },
  { id: '2', description: 'Panera', amount: -15.30, category: 'RESTAURANTS', date: new Date().toISOString(), icon: '🍽️' },
  { id: '3', description: 'Apple TV+', amount: -11.00, category: 'STREAMING', date: new Date(Date.now() - 86400000).toISOString(), icon: '📺' },
  { id: '4', description: 'Rock Climbing', amount: -100.00, category: 'ENTERTAINMENT', date: new Date(Date.now() - 86400000).toISOString(), icon: '🧗' },
  { id: '5', description: 'Hulu', amount: -12.00, category: 'STREAMING', date: new Date(Date.now() - 86400000).toISOString(), icon: '📺' },
  { id: '6', description: 'Petco', amount: -40.00, category: 'PETS', date: new Date(Date.now() - 86400000).toISOString(), icon: '🐕' },
  { id: '7', description: 'Amazon', amount: -50.00, category: 'SHOPPING', date: new Date(Date.now() - 86400000).toISOString(), icon: '📦' },
  { id: '8', description: 'Amazon Gift', amount: -10.00, category: 'GIFTS', date: new Date(Date.now() - 259200000).toISOString(), icon: '🎁' },
  { id: '9', description: 'Phone Bill', amount: -90.00, category: 'PHONE', date: new Date(Date.now() - 259200000).toISOString(), icon: '📱' },
  { id: '10', description: 'ASPCA', amount: -60.00, category: 'DONATIONS', date: new Date(Date.now() - 345600000).toISOString(), icon: '❤️' },
  { id: '11', description: 'Ramen Spot', amount: -7.00, category: 'RESTAURANTS', date: new Date(Date.now() - 432000000).toISOString(), icon: '🍜' },
];

const formatCurrency = (amount: number) => {
  const formatted = Math.abs(amount).toFixed(2);
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'TODAY';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'YESTERDAY';
  } else {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
    return `${dayOfWeek}, ${monthDay}`;
  }
};

const getCategoryColor = (category: string) => {
  const categoryColors: Record<string, string> = {
    UBER: '#fbbf24',
    RESTAURANTS: '#fb923c',
    'APPLE TV': '#94a3b8',
    ENTERTAINMENT: '#ef4444',
    HULU: '#10b981',
    PETS: '#8b5cf6',
    SHOPPING: '#ec4899',
    GIFTS: '#f97316',
    PHONE: '#3b82f6',
    DONATIONS: '#f59e0b',
  };
  return categoryColors[category] || colors.textSecondary;
};

// Group transactions by date
const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    const dateKey = formatDate(transaction.date);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });

  return grouped;
};

export default function TransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const checkDemo = async () => {
      const demoFlag = await SecureStore.getItemAsync('is_demo');
      setIsDemo(demoFlag === 'true');
    };
    checkDemo();
  }, []);

  const filteredTransactions = ALL_TRANSACTIONS.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

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
        <Text style={styles.title}>Transactions</Text>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {Object.entries(groupedTransactions).map(([dateKey, transactions]) => (
          <View key={dateKey} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{dateKey}</Text>
            {transactions.map((transaction) => (
              <Pressable
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => {
                  // Navigate to transaction detail
                }}
              >
                <View style={styles.transactionLeft}>
                  {transaction.icon && (
                    <View style={styles.iconContainer}>
                      <Text style={styles.transactionIcon}>{transaction.icon}</Text>
                    </View>
                  )}
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(transaction.category) },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>{transaction.category}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

        {/* Floating Action Button */}
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
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
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  menuButton: {
    padding: spacing[2],
  },
  menuIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[20],
  },
  dateGroup: {
    marginBottom: spacing[6],
  },
  dateHeader: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing[3],
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIcon: {
    fontSize: 18,
  },
  transactionDescription: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  transactionAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  fab: {
    position: 'absolute',
    right: spacing[6],
    bottom: spacing[20],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: '300',
  },
});
