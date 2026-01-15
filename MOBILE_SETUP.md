# 🚀 Mobile App Setup - Copilot-Inspired Design

Your mobile app now has a beautiful Copilot-inspired authentication flow!

## ✅ What Was Updated:

1. **New auth screens created** in `apps/mobile/app/auth/`:
   - `welcome.tsx` - Beautiful welcome screen with demo mode
   - `signin.tsx` - Sign in screen
   - `signup.tsx` - Multi-step sign up flow

2. **Design tokens added** in `apps/mobile/styles/tokens.ts`:
   - Colors (dark theme)
   - Spacing
   - Typography
   - Shadows

3. **Routing updated**:
   - App now starts at `/auth/welcome` instead of dashboard
   - Old `(auth)/sign-in.tsx` removed

## 🎯 How to Run:

### 1. Start the Mobile Server

```bash
cd safetospend/apps/mobile
pnpm dev
```

You'll see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### 2. Open on Your Device

**iPhone:**
- Open Camera app
- Point at QR code
- Tap the notification to open in Expo Go

**Android:**
- Open Expo Go app
- Tap "Scan QR Code"
- Scan the code in terminal

**iOS Simulator (Mac only):**
```bash
pnpm dev -- --ios
# Or press 'i' in the terminal
```

**Android Emulator:**
```bash
pnpm dev -- --android
# Or press 'a' in the terminal
```

### 3. You'll See:

The new **Copilot-inspired welcome screen** with:
- Beautiful gradient background
- "Demo Mode ▸" button (top right)
- "Sign up with Apple" button (white)
- "Sign up with your email" button (blue)
- "Already have an account? Log in →" link

## 🎨 What's Different:

### Old Design:
- Simple, basic UI
- Light colors
- Generic layout

### New Design (Copilot-inspired):
- **Dark theme** (#0a0e1a background)
- **Gradient backgrounds**
- **Demo mode** for trying the app
- **Multi-step signup** (name → email → password)
- **Progress indicators**
- **Smooth animations**
- **Modern buttons** with hover effects

## 📱 Try the Flows:

### 1. Demo Mode
1. Tap "Demo Mode ▸" (top right)
2. Modal appears: "Entering demo mode"
3. Tap "Let's do this"
4. Redirects to dashboard with demo data

### 2. Sign Up
1. Tap "Sign up with your email"
2. Enter your name → Tap "Next"
3. Enter your email → Tap "Next"
4. Create password → Tap "Create account"
5. Redirects to dashboard

### 3. Sign In
1. Tap "Already have an account? Log in →"
2. Enter email and password
3. Tap "Continue"
4. Redirects to dashboard

## ⚙️ Configuration for Physical Device:

If testing on a **physical device** (not simulator), update the API URL:

### Find Your Computer's IP:

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address"
```

### Update API URLs:

Edit these files and replace `localhost` with your IP:

**apps/mobile/app/auth/welcome.tsx** (line ~25):
```typescript
const response = await fetch('http://YOUR_IP:3000/api/auth/demo', {
```

**apps/mobile/app/auth/signin.tsx** (line ~19):
```typescript
const response = await fetch('http://YOUR_IP:3000/api/auth/signin', {
```

**apps/mobile/app/auth/signup.tsx** (line ~51):
```typescript
const response = await fetch('http://YOUR_IP:3000/api/auth/signup', {
```

Example:
```typescript
// If your IP is 192.168.1.100
const response = await fetch('http://192.168.1.100:3000/api/auth/demo', {
```

## 🐛 Troubleshooting:

### "Network request failed"
- ✅ Make sure web server is running: `cd apps/web && pnpm dev`
- ✅ Update API URLs with your computer's IP (see above)
- ✅ Both devices on same WiFi network
- ✅ Firewall not blocking port 3000

### "Can't find variable: LinearGradient"
- ✅ Make sure `expo-linear-gradient` is installed
- ✅ Run: `cd apps/mobile && pnpm install`
- ✅ Restart the dev server

### "Unable to resolve module"
- ✅ Clear Metro cache: `pnpm start -- --clear`
- ✅ Delete node_modules: `rm -rf node_modules && pnpm install`

### Old screen still showing
- ✅ Force close Expo Go app
- ✅ Reopen and scan QR code again
- ✅ Shake device and tap "Reload"

## 🎉 Next Steps:

1. **Test all flows** (demo, signup, signin)
2. **Customize colors** in `styles/tokens.ts`
3. **Add secure storage** with expo-secure-store
4. **Implement Apple Sign In** with expo-apple-authentication
5. **Build dashboard screens** with the new design

## 📚 Design System:

All screens use the design tokens:

```typescript
import { colors, spacing, typography } from '../../styles/tokens';

// Colors
colors.bgPrimary      // #0a0e1a
colors.brandPrimary   // #4a8fe7
colors.textPrimary    // #f9fafb

// Spacing
spacing[4]   // 16px
spacing[6]   // 24px
spacing[8]   // 32px

// Typography
typography.fontSize.base     // 16px
typography.fontSize['2xl']   // 24px
typography.fontWeight.semibold  // 600
```

## 🚀 You're All Set!

Run `pnpm dev` in the mobile folder and scan the QR code. You'll see your beautiful new Copilot-inspired auth flow!

Questions? Check:
- `apps/mobile/app/auth/README.md` - Auth flow docs
- `apps/mobile/styles/tokens.ts` - Design tokens
- Expo Router docs: https://docs.expo.dev/router/
