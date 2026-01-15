import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  StatusBar,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/tokens';

// Use localhost for iOS simulator, computer's IP for physical devices
const getApiBaseUrl = () => {
  const configUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  // Always use the configured IP for now (works for all scenarios)
  // You can change this back to localhost if testing on iOS Simulator
  return configUrl || 'http://192.168.1.186:3000';

  // Original logic (commented out for debugging):
  // For iOS Simulator, localhost works
  // if (Platform.OS === 'ios' && !Constants.isDevice) {
  //   return 'http://localhost:3000';
  // }

  // For Android Emulator, use 10.0.2.2 (special alias for host machine)
  // if (Platform.OS === 'android' && !Constants.isDevice) {
  //   return 'http://10.0.2.2:3000';
  // }

  // For physical devices, use the configured IP
  // return configUrl || 'http://192.168.1.186:3000';
};

const API_BASE_URL = getApiBaseUrl();

export default function WelcomeScreen() {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleDemoMode = async () => {
    setIsLoadingDemo(true);

    console.log('Demo Mode - Starting...');
    console.log('Demo Mode - API URL:', API_BASE_URL);
    console.log('Demo Mode - Platform:', Platform.OS);
    console.log('Demo Mode - Is Device:', Constants.isDevice);

    try {
      console.log('Demo Mode - Fetching from:', `${API_BASE_URL}/api/auth/demo`);

      const response = await fetch(`${API_BASE_URL}/api/auth/demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Demo Mode - Response status:', response.status);
      console.log('Demo Mode - Response ok:', response.ok);

      const data = await response.json();
      console.log('Demo Mode - Response data:', data);

      if (data.success && data.token) {
        console.log('Demo Mode - Token received, storing...');
        // Store demo token securely
        await SecureStore.setItemAsync('auth_token', data.token);
        await SecureStore.setItemAsync('is_demo', 'true');
        console.log('Demo Mode - Token stored, navigating...');

        // Navigate to dashboard
        router.replace('/(app)/dashboard');
      } else {
        console.log('Demo Mode - Failed:', data);
        Alert.alert('Demo Mode', 'Failed to start demo mode. Please try again.');
      }
    } catch (error) {
      console.error('Demo mode error:', error);
      Alert.alert(
        'Connection Error',
        `Could not connect to ${API_BASE_URL}\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoadingDemo(false);
      setShowDemoModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a2942', '#0a0e1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Demo Mode Button */}
      <View style={styles.header}>
        <Pressable
          style={styles.demoButton}
          onPress={() => setShowDemoModal(true)}
        >
          <Text style={styles.demoButtonText}>Demo Mode ▸</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Hero Section with Logo/Illustration */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>
            Let's Do Money{'\n'}Better
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Apple Sign In */}
          <Pressable style={styles.appleButton}>
            <Text style={styles.appleIcon}>🍎</Text>
            <Text style={styles.appleButtonText}>Sign up with Apple</Text>
          </Pressable>

          {/* Email Sign Up */}
          <Pressable
            style={styles.emailButton}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.emailButtonText}>Sign up with your email</Text>
          </Pressable>

          {/* Sign In Link */}
          <Pressable onPress={() => router.push('/auth/signin')}>
            <Text style={styles.signInLink}>
              Already have an account?{' '}
              <Text style={styles.signInLinkBold}>Log in →</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Demo Mode Modal */}
      <Modal
        visible={showDemoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDemoModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDemoModal(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Entering demo mode</Text>
                <Text style={styles.modalText}>
                  Feel free to play around! You'll be able to start setting up
                  your Safe to Spend account once you come back.
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={() => setShowDemoModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalConfirmButton}
                    onPress={handleDemoMode}
                    disabled={isLoadingDemo}
                  >
                    <Text style={styles.modalConfirmText}>
                      {isLoadingDemo ? 'Loading...' : "Let's do this"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? spacing[12] : spacing[8],
    paddingHorizontal: spacing[6],
    alignItems: 'flex-end',
  },
  demoButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[8],
  },
  logoContainer: {
    width: 200,
    height: 200,
    marginBottom: spacing[8],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
  },
  actions: {
    gap: spacing[4],
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
  emailButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  emailButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  signInLink: {
    textAlign: 'center',
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  signInLinkBold: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: spacing[6],
  },
  modal: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius['2xl'],
    padding: spacing[8],
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.xl,
  },
  modalTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  modalText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing[8],
  },
  modalActions: {
    gap: spacing[3],
  },
  modalCancelButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  modalConfirmButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.lg,
  },
  modalConfirmText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
