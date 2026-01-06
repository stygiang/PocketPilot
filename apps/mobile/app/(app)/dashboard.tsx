import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

type SummaryResponse = {
  summary: {
    safeTodayCents: number;
    safePerDayCents: number;
    safeUntilPaydayCents: number;
    nextPaydayISO: string;
    daysLeftInclusive: number;
    warnings: Array<{ code: string; message: string }>;
  };
};

const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function DashboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/me/summary');
        setData(response as SummaryResponse);
      } catch {
        setError('Unable to load summary.');
      }
    };
    load();
  }, []);

  const summary = data?.summary;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Safe to Spend</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.label}>Safe Today</Text>
          <Text style={styles.metric}>{formatCurrency(summary?.safeTodayCents ?? 0)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Per Day</Text>
          <Text style={styles.metric}>{formatCurrency(summary?.safePerDayCents ?? 0)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Safe Until Payday</Text>
        <Text style={styles.metric}>{formatCurrency(summary?.safeUntilPaydayCents ?? 0)}</Text>
        <Text style={styles.subtext}>Next payday: {summary?.nextPaydayISO || 'Add income'}</Text>
      </View>

      {summary?.warnings?.length ? (
        <View style={styles.card}>
          {summary.warnings.map((warning) => (
            <Text key={warning.code} style={styles.warning}>
              {warning.message}
            </Text>
          ))}
        </View>
      ) : null}

      <Pressable style={styles.primaryButton} onPress={() => router.push('/(app)/add-expense')}>
        <Text style={styles.primaryButtonText}>Quick add expense</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0d9cf',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#666',
  },
  metric: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 6,
  },
  subtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  warning: {
    color: '#c4633c',
    fontSize: 12,
  },
  error: {
    color: '#c4633c',
  },
  primaryButton: {
    backgroundColor: '#1c1c1c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
