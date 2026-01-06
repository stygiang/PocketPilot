import { useEffect, useState } from 'react';
import { Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { apiFetch } from '../../lib/api';

const toCents = (value: string) => Math.round(Number(value) * 100);

export default function SettingsScreen() {
  const [timezone, setTimezone] = useState('UTC');
  const [savings, setSavings] = useState('0');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch('/api/settings');
      if (data?.timezone) {
        setTimezone(data.timezone);
      }
      if (typeof data?.plannedSavingsCentsPerPaycheck === 'number') {
        setSavings((data.plannedSavingsCentsPerPaycheck / 100).toFixed(2));
      }
    };
    load();
  }, []);

  const save = async () => {
    await apiFetch('/api/settings', undefined, {
      method: 'PATCH',
      body: JSON.stringify({
        timezone,
        plannedSavingsCentsPerPaycheck: toCents(savings),
      }),
    });
    setMessage('Saved.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TextInput style={styles.input} value={timezone} onChangeText={setTimezone} />
      <TextInput
        style={styles.input}
        value={savings}
        onChangeText={setSavings}
        keyboardType="decimal-pad"
      />
      <Pressable style={styles.primaryButton} onPress={save}>
        <Text style={styles.primaryButtonText}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: '600' },
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
  message: {
    color: '#2f6f3e',
  },
});
