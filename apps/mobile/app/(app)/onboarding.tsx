import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

const toCents = (value: string) => Math.round(Number(value) * 100);

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [balance, setBalance] = useState('');
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCadence, setIncomeCadence] = useState('BIWEEKLY');
  const [incomeNextDate, setIncomeNextDate] = useState('');
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDay, setBillDueDay] = useState('1');
  const [savings, setSavings] = useState('');
  const [error, setError] = useState('');

  const tokenFetch = async (path: string, payload: Record<string, unknown>, method = 'POST') => {
    return apiFetch(path, undefined, { method, body: JSON.stringify(payload) });
  };

  const next = async () => {
    try {
      setError('');
      if (step === 1) {
        await tokenFetch('/api/balance', { balanceCents: toCents(balance) });
      }
      if (step === 2) {
        await tokenFetch('/api/income', {
          name: incomeName,
          amountCents: toCents(incomeAmount),
          cadence: incomeCadence,
          nextPayDate: incomeNextDate,
          active: true,
        });
      }
      if (step === 3 && billName) {
        await tokenFetch('/api/bills', {
          name: billName,
          amountCents: toCents(billAmount),
          cadence: 'MONTHLY',
          dueDayOfMonth: Number(billDueDay),
          active: true,
        });
      }
      if (step === 4) {
        await tokenFetch(
          '/api/settings',
          { plannedSavingsCentsPerPaycheck: toCents(savings || '0') },
          'PATCH',
        );
        router.replace('/(app)/dashboard');
        return;
      }
      setStep((prev) => prev + 1);
    } catch {
      setError('Please check your inputs.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Text style={styles.subtitle}>Step {step} of 4</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {step === 1 && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Current balance"
            keyboardType="decimal-pad"
            value={balance}
            onChangeText={setBalance}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Income name"
            value={incomeName}
            onChangeText={setIncomeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Income amount"
            keyboardType="decimal-pad"
            value={incomeAmount}
            onChangeText={setIncomeAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Cadence (WEEKLY/BIWEEKLY/MONTHLY)"
            value={incomeCadence}
            onChangeText={setIncomeCadence}
          />
          <TextInput
            style={styles.input}
            placeholder="Next pay date YYYY-MM-DD"
            value={incomeNextDate}
            onChangeText={setIncomeNextDate}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Bill name (optional)"
            value={billName}
            onChangeText={setBillName}
          />
          <TextInput
            style={styles.input}
            placeholder="Bill amount"
            keyboardType="decimal-pad"
            value={billAmount}
            onChangeText={setBillAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Due day of month"
            keyboardType="number-pad"
            value={billDueDay}
            onChangeText={setBillDueDay}
          />
        </View>
      )}

      {step === 4 && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Planned savings per paycheck"
            keyboardType="decimal-pad"
            value={savings}
            onChangeText={setSavings}
          />
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={next}>
        <Text style={styles.primaryButtonText}>{step === 4 ? 'Finish' : 'Next'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0d9cf',
    borderRadius: 12,
    padding: 12,
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
  error: {
    color: '#c4633c',
  },
});
