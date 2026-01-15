import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getAuthToken } from '../../lib/auth';
import { colors, borderRadius } from '../../styles/tokens';

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgPrimary }}>
        <ActivityIndicator color={colors.brandPrimary} />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/auth/welcome" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBarWrapper}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bgSecondary,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderMedium,
              height: 48,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarPosition: 'top',
            tabBarActiveTintColor: colors.brandPrimary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'capitalize',
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.brandPrimary,
              height: 2,
            },
            tabBarScrollEnabled: true,
            tabBarItemStyle: {
              width: 'auto',
              paddingHorizontal: 16,
            },
          }}
        >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
        }}
      />
      </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  tabBarWrapper: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
});
