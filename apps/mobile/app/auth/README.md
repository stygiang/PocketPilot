# Mobile Authentication Flow

React Native auth screens inspired by Copilot's elegant design.

## 🎨 Screens

### 1. **Welcome Screen** (`/auth/welcome`)
- Beautiful gradient background
- **Demo Mode** button (top right)
- Sign up with Apple
- Sign up with email
- Demo mode modal

### 2. **Sign In** (`/auth/signin`)
- Back button navigation
- Apple Sign In option
- Email/password inputs
- Forgot password link
- Sign up link

### 3. **Sign Up** (`/auth/signup`)
- Multi-step flow (name → email → password)
- Progress bar indicator
- Back navigation
- Inline validation

## 🚀 Routes

```
/auth/welcome    → Landing screen
/auth/signin     → Sign in
/auth/signup     → Multi-step signup
```

## 📱 Features

### Design Tokens
All styling uses shared design tokens from `styles/tokens.ts`:
```typescript
import { colors, spacing, typography, borderRadius } from '../../styles/tokens';
```

### Demo Mode
- Tapping "Demo Mode ▸" shows confirmation modal
- Calls `/api/auth/demo` endpoint
- Navigates to dashboard on success

### Multi-Step Signup
- **Step 1**: First name + last name (optional)
- **Step 2**: Email address
- **Step 3**: Password (min 6 chars)
- Progress bar shows 33% → 66% → 100%

### Responsive Design
- KeyboardAvoidingView for input fields
- ScrollView for content
- Platform-specific padding (iOS/Android)
- Touch-friendly button sizes

## 🔧 Setup

### 1. Install Dependencies

Already installed:
- `expo-linear-gradient` (for gradients)
- `expo-router` (for navigation)

### 2. Update API URL

For physical device testing, update the API URL in each auth screen:

```typescript
// Replace localhost with your computer's IP
const API_URL = 'http://192.168.1.x:3000';
```

Find your IP:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### 3. Run the App

```bash
cd apps/mobile
pnpm dev

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
```

## 🎯 Navigation Flow

### New User:
```
Welcome → Signup (Name) → Email → Password → Dashboard
```

### Returning User:
```
Welcome → Signin → Dashboard
```

### Demo Mode:
```
Welcome → Demo Modal → Confirm → Dashboard
```

## 🎨 Design System

### Colors
```typescript
colors.bgPrimary      // #0a0e1a - Main background
colors.bgTertiary     // #1a2332 - Cards, inputs
colors.brandPrimary   // #4a8fe7 - Primary blue
colors.textPrimary    // #f9fafb - White text
colors.textSecondary  // #9ca3af - Gray text
```

### Spacing
```typescript
spacing[4]  // 16px - Standard padding
spacing[6]  // 24px - Section spacing
spacing[8]  // 32px - Large gaps
```

### Typography
```typescript
typography.fontSize.base    // 16px
typography.fontSize['2xl']  // 24px
typography.fontWeight.semibold  // 600
```

## 🔐 API Integration

### Demo Mode
```typescript
POST http://localhost:3000/api/auth/demo

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "demo-user",
    "isDemo": true
  }
}
```

### Sign In
```typescript
POST http://localhost:3000/api/auth/signin
Body: { email, password }
```

### Sign Up
```typescript
POST http://localhost:3000/api/auth/signup
Body: { email, password, name }
```

## 🧪 Testing

### On Simulator/Emulator
```bash
# API runs on localhost:3000
# No changes needed
```

### On Physical Device
1. Find your computer's IP address
2. Update API URL in each auth screen
3. Make sure web server is running
4. Both devices on same WiFi network

```typescript
// auth/welcome.tsx, auth/signin.tsx, auth/signup.tsx
const response = await fetch('http://YOUR_IP:3000/api/auth/demo', {
  method: 'POST',
});
```

## 🎯 Next Steps

### Immediate
- ✅ Welcome screen with demo mode
- ✅ Sign in screen
- ✅ Multi-step sign up
- ✅ Design tokens

### Future Enhancements
- [ ] Apple Sign In integration (expo-apple-authentication)
- [ ] Secure token storage (expo-secure-store)
- [ ] Biometric authentication (expo-local-authentication)
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Form validation library
- [ ] Remember me checkbox
- [ ] Password visibility toggle

## 🛠️ Customization

### Update Colors
Edit `styles/tokens.ts`:
```typescript
export const colors = {
  brandPrimary: '#your-color',
  // ... other colors
};
```

### Add New Screen
```typescript
// app/auth/forgot-password.tsx
import { colors, spacing } from '../../styles/tokens';

export default function ForgotPasswordScreen() {
  // Your screen code
}
```

### Modify Navigation
```typescript
// In any auth screen
router.push('/auth/your-screen');
router.back(); // Go back
router.replace('/(app)/dashboard'); // Replace stack
```

## 📚 Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Copilot Design Reference](https://copilot.money)

## 💡 Tips

### For Developers
- Use design tokens for consistency
- Test on both iOS and Android
- Handle keyboard properly
- Test on physical devices

### Common Issues
**"Network request failed"**:
- Update API URL to your computer's IP
- Check if web server is running
- Verify both devices on same network

**"TypeError: undefined is not an object"**:
- Check API response format
- Add error handling
- Log response data

**"KeyboardAvoidingView not working"**:
- Wrap in KeyboardAvoidingView
- Use proper behavior (iOS: 'padding', Android: 'height')
- Add keyboardShouldPersistTaps="handled" to ScrollView

## 🎉 Demo

To see the flow in action:

1. Start the web server:
```bash
cd apps/web
pnpm dev
```

2. Start the mobile app:
```bash
cd apps/mobile
pnpm dev
```

3. Scan QR code with Expo Go

4. Navigate to the welcome screen and try:
   - Demo mode
   - Sign up flow
   - Sign in

Enjoy your Copilot-inspired auth flow! 🚀
