import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to new Copilot-inspired welcome screen
  return <Redirect href="/auth/welcome" />;
}
