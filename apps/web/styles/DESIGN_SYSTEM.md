# Safe to Spend - Modern Design System

A comprehensive dark-themed design system inspired by Copilot's clean, sophisticated UI.

## 🎨 Color System

### Background Colors
```scss
$bg-primary: #0a0e1a;      // Main app background
$bg-secondary: #111827;     // Secondary sections
$bg-tertiary: #1a2332;      // Cards, surfaces
$bg-elevated: #1f2937;      // Modals, dropdowns
$bg-input: #0f172a;         // Input fields
```

### Text Colors
```scss
$text-primary: #f9fafb;     // Primary text (headings, important)
$text-secondary: #9ca3af;   // Body text, labels
$text-tertiary: #6b7280;    // Subtle text, placeholders
$text-disabled: #4b5563;    // Disabled state
```

### Brand Colors
```scss
$brand-primary: #4a8fe7;    // Primary blue (CTAs, links)
$brand-secondary: #6366f1;  // Secondary accent (indigo)
$brand-tertiary: #8b5cf6;   // Tertiary accent (purple)
```

### Category Colors (for transactions/expenses)
```scss
$category-food: #f97316;         // Orange - Restaurants, dining
$category-transport: #eab308;    // Yellow-gold - Uber, transport
$category-entertainment: #a855f7; // Purple - Streaming, fun
$category-shopping: #ec4899;     // Pink - Shopping, retail
$category-bills: #3b82f6;        // Blue - Utilities, bills
$category-health: #10b981;       // Green - Health, fitness
$category-travel: #06b6d4;       // Cyan - Travel
$category-home: #8b5cf6;         // Violet - Home, housing
$category-income: #10b981;       // Green - Income
```

## 📦 Components

### Cards

**Basic Card**
```tsx
<div className="card">
  <div className="card-header">
    <h3 className="card-header__title">Card Title</h3>
    <p className="card-header__subtitle">Subtitle text</p>
  </div>
  <div className="card-body">
    Card content goes here
  </div>
</div>
```

**Card Variants**
- `.card--elevated` - Raised card with shadow
- `.card--interactive` - Hover effect with lift
- `.card--glass` - Glassmorphism effect

### Buttons

```tsx
{/* Primary button */}
<button className="btn btn--primary">Save Changes</button>

{/* Secondary button */}
<button className="btn btn--secondary">Cancel</button>

{/* Ghost button */}
<button className="btn btn--ghost">Learn More</button>

{/* Success button */}
<button className="btn btn--success">Approve</button>

{/* Sizes */}
<button className="btn btn--primary btn--sm">Small</button>
<button className="btn btn--primary btn--lg">Large</button>

{/* Full width */}
<button className="btn btn--primary btn--wide">Full Width</button>
```

### Badges

**Category Badges** (Copilot-style)
```tsx
<span className="badge badge--category food">UBER</span>
<span className="badge badge--category entertainment">NETFLIX</span>
<span className="badge badge--category bills">PHONE BILL</span>
```

**Status Badges**
```tsx
<span className="badge badge--success">Active</span>
<span className="badge badge--warning">Pending</span>
<span className="badge badge--error">Overdue</span>
<span className="badge badge--info">Info</span>
```

### Filter Pills

```tsx
<div className="pill">
  Not reviewed
  <button className="pill__close">×</button>
</div>

<div className="pill pill--active">
  Active Filter
</div>
```

### Transaction List

```tsx
<div className="transaction-group">
  <div className="transaction-group__header">
    <span className="transaction-group__date">TODAY</span>
    <span className="transaction-group__total">$221.19</span>
  </div>

  <div className="transaction-item">
    <div className="transaction-item__icon">🚗</div>
    <div className="transaction-item__content">
      <div className="transaction-item__merchant">
        Uber
        <span className="badge badge--category transport">UBER</span>
      </div>
      <div className="transaction-item__category">
        Transportation
      </div>
    </div>
    <div className="transaction-item__amount">$20.89</div>
  </div>

  <div className="transaction-item">
    <div className="transaction-item__icon">🍕</div>
    <div className="transaction-item__content">
      <div className="transaction-item__merchant">
        Panera
        <span className="badge badge--category food">RESTAURANTS</span>
      </div>
      <div className="transaction-item__category">
        Food & Dining
      </div>
    </div>
    <div className="transaction-item__amount">$15.30</div>
  </div>
</div>
```

### Stats Display

```tsx
<div className="stat">
  <div className="stat__label">Safe to Spend</div>
  <div className="stat__value stat--large">$1,245.50</div>
  <div className="stat__change stat__change--up">
    ↑ $125 from last month
  </div>
  <div className="stat__subtext">Available until next payday</div>
</div>
```

### Input Fields

```tsx
{/* Basic input */}
<input type="text" className="input" placeholder="Enter amount" />

{/* Input with label */}
<label className="label">Email Address</label>
<input type="email" className="input" placeholder="you@example.com" />

{/* Input with icon */}
<div className="input-group input-group--with-icon">
  <div className="input-group__icon">🔍</div>
  <input type="text" className="input" placeholder="Search..." />
</div>

{/* Error state */}
<input type="text" className="input input--error" />

{/* Select dropdown */}
<select className="select">
  <option>Select category</option>
  <option>Food & Dining</option>
  <option>Transportation</option>
</select>
```

### Search Bar

```tsx
<div className="search-bar">
  <div className="search-bar__icon">🔍</div>
  <input
    type="text"
    className="search-bar__input"
    placeholder="Search transactions..."
  />
</div>
```

### Modals

```tsx
{/* Backdrop */}
<div className="modal-backdrop" />

{/* Modal */}
<div className="modal">
  <div className="modal__header">
    <h2 className="modal__title">Transaction Details</h2>
  </div>
  <div className="modal__body">
    Modal content goes here
  </div>
  <div className="modal__footer">
    <button className="btn btn--secondary">Cancel</button>
    <button className="btn btn--primary">Save</button>
  </div>
</div>
```

## 📐 Spacing Scale

```scss
$space-1: 4px
$space-2: 8px
$space-3: 12px
$space-4: 16px
$space-5: 20px
$space-6: 24px
$space-8: 32px
$space-10: 40px
$space-12: 48px
```

## 🔤 Typography

### Font Families
```scss
$font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```scss
$text-xs: 12px
$text-sm: 14px
$text-base: 16px
$text-lg: 18px
$text-xl: 20px
$text-2xl: 24px
$text-3xl: 30px
$text-4xl: 36px
```

### Font Weights
```scss
$font-regular: 400
$font-medium: 500
$font-semibold: 600
$font-bold: 700
```

## 🔲 Border Radius

```scss
$radius-sm: 6px      // Small elements
$radius-md: 8px      // Default
$radius-lg: 12px     // Cards
$radius-xl: 16px     // Large cards
$radius-2xl: 20px    // Modals
$radius-full: 9999px // Pills, circular buttons
```

## 💫 Shadows

```scss
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3)
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.35)
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.4)
$shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.45)
```

## 🎬 Transitions

```scss
$transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
$transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
$transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

## 📱 Breakpoints

```scss
$breakpoint-sm: 640px
$breakpoint-md: 768px
$breakpoint-lg: 1024px
$breakpoint-xl: 1280px
```

## 🛠️ Usage

### Importing the Design System

```scss
// In your component's SCSS file
@import '../../styles/design-tokens';
@import '../../styles/modern-components';

.my-component {
  background: $bg-tertiary;
  padding: $space-6;
  border-radius: $radius-xl;
  color: $text-primary;
}
```

### Using Components in React/Next.js

```tsx
// Import styles
import styles from './MyComponent.module.scss';

// Use design system classes
export function MyComponent() {
  return (
    <div className="card card--elevated">
      <div className="card-header">
        <h3 className="card-header__title">Dashboard</h3>
      </div>
      <div className="card-body">
        <button className="btn btn--primary">
          Add Transaction
        </button>
      </div>
    </div>
  );
}
```

## 🎯 Design Principles

1. **Dark First** - Optimized for dark theme with OLED-friendly blacks
2. **Subtle Borders** - Use `rgba(255, 255, 255, 0.06)` for gentle separation
3. **Layered Surfaces** - Create depth with multiple background levels
4. **Colorful Accents** - Category badges use vibrant colors for quick recognition
5. **Generous Spacing** - Use 16px (space-4) minimum for breathing room
6. **Smooth Transitions** - All interactive elements have 200ms transitions
7. **High Contrast Text** - Ensure readability with proper text color hierarchy

## 📚 Examples

See the following files for complete examples:
- `/app/(marketing)/page.tsx` - Marketing page with full component usage
- `/styles/_modern-components.scss` - All component definitions
- `/styles/_design-tokens.scss` - Complete token reference

## 🔗 Resources

- [Copilot App](https://copilot.money) - Design inspiration
- [Inter Font](https://rsms.me/inter/) - Recommended font
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility tool
