import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { apiFetch } from '../../lib/api';

export default function IncomeScreen() {
  const [income, setIncome] = useState<Array<{ id: string; name: string; amountCents: number }>>([]);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch('/api/income');
      setIncome(data);
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Income</Text>
      {income.length === 0 ? (
        <Text style={styles.empty}>No income sources yet.</Text>
      ) : (
        income.map((source) => (
          <View key={source.id} style={styles.card}>
            <Text style={styles.cardTitle}>{source.name}</Text>
            <Text style={styles.cardText}>${(source.amountCents / 100).toFixed(2)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderColor: '#e0d9cf',
    borderRadius: 12,
    padding: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardText: { marginTop: 4, color: '#666' },
  empty: { color: '#666' },
});
