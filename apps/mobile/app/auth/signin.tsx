import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/tokens';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and navigate to dashboard
        router.push('/(app)/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            If you already have a Safe to Spend account, sign in below to proceed.
          </Text>
        </View>

        {/* Apple Sign In */}
        <Pressable style={styles.appleButton}>
          <Text style={styles.appleIcon}>🍎</Text>
          <Text style={styles.appleButtonText}>Sign in with Apple</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR ENTER YOUR EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Signing in...' : 'Continue'}
          </Text>
        </Pressable>

        {/* Forgot Password */}
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </Pressable>

        {/* Sign Up Link */}
        <Pressable
          style={styles.signUpLink}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={styles.signUpLinkText}>
            Don't have an account?{' '}
            <Text style={styles.signUpLinkBold}>Sign up →</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingTop: Platform.OS === 'ios' ? spacing[12] : spacing[8],
    paddingBottom: spacing[8],
  },
  backButton: {
    marginBottom: spacing[8],
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing[8],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing[6],
    ...shadows.md,
  },
  appleIcon: {
    fontSize: typography.fontSize.xl,
  },
  appleButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: spacing[4],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  errorContainer: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: spacing[4],
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  input: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: borderRadius.lg,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
  },
  submitButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    marginTop: spacing[2],
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: spacing[6],
  },
  forgotPasswordText: {
    color: colors.brandPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  signUpLink: {
    marginTop: spacing[8],
  },
  signUpLinkText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signUpLinkBold: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});
