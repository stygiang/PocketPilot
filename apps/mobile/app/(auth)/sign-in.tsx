import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { apiBaseUrl } from '../../lib/api';
import { setAuthToken } from '../../lib/auth';

const logo = require('../../assets/logo.png');

type Mode = 'signIn' | 'signUp';

type AuthResponse = {
  token?: string;
};

export default function SignInScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getFriendlyError = (message: string) => {
    if (message.includes('Email already in use')) {
      return 'An account with that email already exists. Try signing in.';
    }
    if (message.includes('Invalid credentials')) {
      return 'That email or password is incorrect.';
    }
    if (message.includes('Invalid input')) {
      return 'Check your email and password (8+ characters).';
    }
    return mode === 'signIn'
      ? 'Unable to sign in. Check your email and password.'
      : 'Unable to create account. Try a stronger password.';
  };

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'signIn' ? '/api/auth/signin' : '/api/auth/signup';
      const res = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(getFriendlyError(message));
        return;
      }

      const data = (await res.json()) as AuthResponse;
      if (!data.token) {
        setError('Missing session token. Try again.');
        return;
      }

      await setAuthToken(data.token);
      router.replace(mode === 'signIn' ? '/(app)/dashboard' : '/(app)/onboarding');
    } catch {
      setError('Unable to continue. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.logoWrap}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{mode === 'signIn' ? 'Welcome back' : 'Create account'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'signIn'
            ? 'See what is safe to spend today.'
            : 'Start tracking safe-to-spend in minutes.'}
        </Text>
        {error ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.primaryButton} onPress={handleAuth} disabled={loading}>
          <Text style={styles.primaryButtonText}>
            {loading ? 'Working...' : mode === 'signIn' ? 'Sign in' : 'Sign up'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.toggleButton}
          onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
        >
          <Text style={styles.toggleText}>
            {mode === 'signIn'
              ? 'New here? Create an account'
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f6f2e9',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e7e1d6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  logoWrap: {
    position: 'absolute',
    top: 36,
    alignSelf: 'center',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e0d9cf',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#1c1c1c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  toggleText: {
    color: '#1c1c1c',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  notice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff4ef',
    borderWidth: 1,
    borderColor: '#f2c1a8',
  },
  noticeText: {
    color: '#9c3b1d',
    fontSize: 12,
    textAlign: 'center',
  },
});
