# Modern Design System

A comprehensive dark-themed design system inspired by Copilot's elegant UI.

## 🚀 Quick Start

### View the Design System

Visit `/design-system` in your browser to see all components, colors, and patterns in action.

```bash
npm run dev
# Navigate to http://localhost:3000/design-system
```

### Using Components

```tsx
import './styles/globals.scss'; // Already imported in layout.tsx

export function MyComponent() {
  return (
    <div className="card card--elevated">
      <div className="card-header">
        <h3 className="card-header__title">Dashboard</h3>
      </div>
      <div className="card-body">
        <button className="btn btn--primary">Get Started</button>
      </div>
    </div>
  );
}
```

### Using Design Tokens in SCSS Modules

```scss
// MyComponent.module.scss
@import '../../styles/design-tokens';

.customCard {
  background: $bg-tertiary;
  border: 1px solid $border-subtle;
  border-radius: $radius-xl;
  padding: $space-6;
  color: $text-primary;
  transition: all $transition-base;

  &:hover {
    border-color: $border-medium;
    box-shadow: $shadow-lg;
  }
}
```

## 📂 File Structure

```
styles/
├── _design-tokens.scss      # All design tokens (colors, spacing, typography)
├── _modern-base.scss         # Base styles, resets, typography
├── _modern-components.scss   # Reusable UI components
├── globals.scss              # Main entry point
├── DESIGN_SYSTEM.md          # Complete documentation
└── README.md                 # This file

app/
└── design-system/
    ├── page.tsx              # Component showcase
    └── page.module.scss      # Showcase styles
```

## 🎨 Core Concepts

### 1. **Dark-First Design**
All colors optimized for dark backgrounds:
- `$bg-primary` - Deep navy-black (#0a0e1a)
- `$bg-tertiary` - Card backgrounds (#1a2332)
- `$text-primary` - White text (#f9fafb)

### 2. **Category Color System**
Vibrant colors for quick visual categorization:
```scss
$category-food: #f97316;        // Orange
$category-transport: #eab308;   // Gold
$category-entertainment: #a855f7; // Purple
$category-shopping: #ec4899;    // Pink
```

Usage:
```tsx
<span className="badge badge--category food">RESTAURANTS</span>
```

### 3. **Layered Surfaces**
Create depth with multiple background levels:
- Cards on `$bg-tertiary`
- Modals on `$bg-elevated`
- Hover states with subtle background changes

### 4. **Smooth Interactions**
All interactive elements have 200ms transitions:
```scss
transition: all $transition-base; // 200ms cubic-bezier
```

## 🧩 Common Patterns

### Transaction List (Copilot-style)

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
      <div className="transaction-item__category">Transportation</div>
    </div>
    <div className="transaction-item__amount">$20.89</div>
  </div>
</div>
```

### Stats Display

```tsx
<div className="card">
  <div className="stat">
    <div className="stat__label">Safe to Spend</div>
    <div className="stat__value stat__value--large">$1,245.50</div>
    <div className="stat__change stat__change--up">↑ $125 from last month</div>
    <div className="stat__subtext">Available until next payday</div>
  </div>
</div>
```

### Form with Search

```tsx
<div className="card">
  <div className="search-bar">
    <div className="search-bar__icon">🔍</div>
    <input
      type="text"
      className="search-bar__input"
      placeholder="Search transactions..."
    />
  </div>

  <div className="divider" />

  <label className="label">Category</label>
  <select className="select">
    <option>All Categories</option>
    <option>Food & Dining</option>
    <option>Transportation</option>
  </select>

  <button className="btn btn--primary btn--wide">Apply Filters</button>
</div>
```

## 🎯 Design Principles

1. **Consistency** - Use design tokens, not hardcoded values
2. **Accessibility** - High contrast ratios (WCAG AA minimum)
3. **Performance** - Use CSS transitions, not JavaScript animations
4. **Responsive** - Mobile-first approach
5. **Dark Optimized** - True blacks for OLED screens

## ⚡ Best Practices

### DO ✅
```scss
// Use design tokens
background: $bg-tertiary;
padding: $space-6;
color: $text-primary;
```

### DON'T ❌
```scss
// Don't hardcode values
background: #1a2332;
padding: 24px;
color: #f9fafb;
```

### DO ✅
```tsx
// Use semantic class names
<button className="btn btn--primary">Save</button>
```

### DON'T ❌
```tsx
// Don't use inline styles
<button style={{ background: '#4a8fe7' }}>Save</button>
```

## 🔧 Customization

### Adding New Colors

Edit `_design-tokens.scss`:
```scss
// Add your custom color
$custom-color: #ff6b6b;

// Use in components
.my-element {
  color: $custom-color;
}
```

### Adding New Components

Edit `_modern-components.scss`:
```scss
.my-component {
  background: $bg-tertiary;
  border-radius: $radius-xl;
  padding: $space-6;

  &__header {
    font-weight: $font-semibold;
    color: $text-primary;
  }

  &--variant {
    background: $bg-elevated;
  }
}
```

## 📚 Full Documentation

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for:
- Complete color palette
- All component variants
- Typography scale
- Spacing system
- Code examples

## 🎨 Design Resources

- **Live Preview**: `/design-system` route
- **Figma**: (Add your Figma link)
- **Inspiration**: [Copilot App](https://copilot.money)
- **Font**: [Inter](https://rsms.me/inter/)

## 🤝 Contributing

When adding new components:
1. Follow BEM naming convention
2. Use design tokens exclusively
3. Add to showcase page
4. Document in DESIGN_SYSTEM.md
5. Test in light and dark environments (currently dark-only)

## 📦 Migration from Old Styles

The old styles are commented out in `globals.scss`:

```scss
// Legacy styles (optional - can be removed after migration)
// @import 'variables';
// @import 'mixins';
// @import 'base';
// @import 'components';
```

To migrate:
1. Replace utility classes with new design system classes
2. Update color references to use new tokens
3. Test all pages
4. Remove legacy files when complete

## 🆘 Need Help?

- Check `/design-system` for live examples
- Review `DESIGN_SYSTEM.md` for complete docs
- Look at existing components for patterns
- Copilot app for design inspiration
