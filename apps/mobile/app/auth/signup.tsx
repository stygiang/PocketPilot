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

type SignUpStep = 'name' | 'email' | 'password';

export default function SignUpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<SignUpStep>('name');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setError('');

    if (step === 'name') {
      if (!formData.firstName.trim()) {
        setError('Please enter your first name');
        return;
      }
      setStep('email');
    } else if (step === 'email') {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      setStep('password');
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        router.push('/(app)/dashboard');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 'email') setStep('name');
    else if (step === 'password') setStep('email');
    else router.back();
  };

  const getProgress = () => {
    if (step === 'name') return 0.33;
    if (step === 'email') return 0.66;
    return 1;
  };

  const getStepTitle = () => {
    if (step === 'name') return 'Create your account';
    if (step === 'email') return "What's your email?";
    return 'Create a password';
  };

  const getStepSubtitle = () => {
    if (step === 'name') return "Let's start with your name";
    if (step === 'email') return "We'll use this to sign you in";
    return 'Choose a secure password';
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
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${getProgress() * 100}%` }]} />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Step 1: Name */}
        {step === 'name' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FIRST NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor={colors.textTertiary}
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                autoFocus
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>LAST NAME (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor={colors.textTertiary}
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                autoCapitalize="words"
              />
            </View>
          </>
        )}

        {/* Step 2: Email */}
        {step === 'email' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor={colors.textTertiary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>
        )}

        {/* Step 3: Password */}
        {step === 'password' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textTertiary}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              autoCapitalize="none"
              autoFocus
            />
            <Text style={styles.hint}>Must be at least 6 characters</Text>
          </View>
        )}

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={step === 'password' ? handleSubmit : handleNext}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading
              ? 'Creating account...'
              : step === 'password'
              ? 'Create account'
              : 'Next'}
          </Text>
        </Pressable>

        {/* Sign In Link (only on first step) */}
        {step === 'name' && (
          <Pressable
            style={styles.signInLink}
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.signInLinkText}>
              Already have an account?{' '}
              <Text style={styles.signInLinkBold}>Log in →</Text>
            </Text>
          </Pressable>
        )}
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
    marginBottom: spacing[6],
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: spacing[8],
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.full,
  },
  header: {
    marginBottom: spacing[8],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
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
    marginBottom: spacing[6],
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing[2],
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
  hint: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
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
  signInLink: {
    marginTop: spacing[8],
  },
  signInLinkText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signInLinkBold: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});
