import { Redirect, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getAuthToken } from '../../lib/auth';

export default function AppLayout() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = await getAuthToken();
      setAuthenticated(Boolean(token));
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Slot />;
}
