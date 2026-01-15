import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../../styles/tokens';

export default function IncomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Income</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
        <Text style={styles.description}>
          Manage your income sources and track your earnings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
    marginBottom: spacing[4],
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.5,
  },
});
