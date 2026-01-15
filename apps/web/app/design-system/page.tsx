/**
 * Design System Showcase
 * View all components and design tokens
 */

import styles from './page.module.scss';

export default function DesignSystemPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1>Safe to Spend Design System</h1>
          <p>A modern dark-themed UI inspired by Copilot</p>
        </header>

        {/* Colors Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Colors</h2>

          <div className={styles.subsection}>
            <h3>Background Colors</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorSwatch} style={{ background: '#0a0e1a' }}>
                <span>Primary</span>
                <code>#0a0e1a</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#111827' }}>
                <span>Secondary</span>
                <code>#111827</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#1a2332' }}>
                <span>Tertiary</span>
                <code>#1a2332</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#1f2937' }}>
                <span>Elevated</span>
                <code>#1f2937</code>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Brand Colors</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorSwatch} style={{ background: '#4a8fe7' }}>
                <span>Primary Blue</span>
                <code>#4a8fe7</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#6366f1' }}>
                <span>Secondary Indigo</span>
                <code>#6366f1</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#8b5cf6' }}>
                <span>Tertiary Purple</span>
                <code>#8b5cf6</code>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Category Colors</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorSwatch} style={{ background: '#f97316' }}>
                <span>Food</span>
                <code>#f97316</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#eab308' }}>
                <span>Transport</span>
                <code>#eab308</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#a855f7' }}>
                <span>Entertainment</span>
                <code>#a855f7</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#ec4899' }}>
                <span>Shopping</span>
                <code>#ec4899</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#3b82f6' }}>
                <span>Bills</span>
                <code>#3b82f6</code>
              </div>
              <div className={styles.colorSwatch} style={{ background: '#10b981' }}>
                <span>Health</span>
                <code>#10b981</code>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Buttons</h2>

          <div className={styles.subsection}>
            <h3>Button Variants</h3>
            <div className={styles.componentRow}>
              <button className="btn btn--primary">Primary Button</button>
              <button className="btn btn--secondary">Secondary Button</button>
              <button className="btn btn--ghost">Ghost Button</button>
              <button className="btn btn--success">Success Button</button>
              <button className="btn btn--danger">Danger Button</button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Button Sizes</h3>
            <div className={styles.componentRow}>
              <button className="btn btn--primary btn--sm">Small</button>
              <button className="btn btn--primary">Default</button>
              <button className="btn btn--primary btn--lg">Large</button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Button States</h3>
            <div className={styles.componentRow}>
              <button className="btn btn--primary">Normal</button>
              <button className="btn btn--primary" disabled>
                Disabled
              </button>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Badges & Pills</h2>

          <div className={styles.subsection}>
            <h3>Category Badges</h3>
            <div className={styles.componentRow}>
              <span className="badge badge--category food">UBER</span>
              <span className="badge badge--category transport">UBER</span>
              <span className="badge badge--category entertainment">NETFLIX</span>
              <span className="badge badge--category shopping">AMAZON</span>
              <span className="badge badge--category bills">PHONE BILL</span>
              <span className="badge badge--category health">GYM</span>
              <span className="badge badge--category income">PAYCHECK</span>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Status Badges</h3>
            <div className={styles.componentRow}>
              <span className="badge badge--success">Success</span>
              <span className="badge badge--warning">Warning</span>
              <span className="badge badge--error">Error</span>
              <span className="badge badge--info">Info</span>
              <span className="badge badge--neutral">Neutral</span>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Filter Pills</h3>
            <div className={styles.componentRow}>
              <div className="pill">
                Not reviewed
                <button className="pill__close">×</button>
              </div>
              <div className="pill pill--active">Active Filter</div>
              <div className="pill">
                Category: Food
                <button className="pill__close">×</button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cards</h2>

          <div className={styles.cardGrid}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-header__title">Basic Card</h3>
                <p className="card-header__subtitle">With header and body</p>
              </div>
              <div className="card-body">
                This is a basic card with header, subtitle, and body content.
              </div>
            </div>

            <div className="card card--elevated">
              <div className="card-header">
                <h3 className="card-header__title">Elevated Card</h3>
              </div>
              <div className="card-body">
                This card has a raised appearance with a shadow effect.
              </div>
            </div>

            <div className="card card--interactive">
              <div className="card-header">
                <h3 className="card-header__title">Interactive Card</h3>
              </div>
              <div className="card-body">
                Hover over this card to see the lift effect.
              </div>
            </div>

            <div className="card card--glass">
              <div className="card-header">
                <h3 className="card-header__title">Glass Card</h3>
              </div>
              <div className="card-body">
                This card has a glassmorphism effect with blur.
              </div>
            </div>
          </div>
        </section>

        {/* Transaction List Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Transaction List</h2>

          <div className="card">
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

              <div className="transaction-item">
                <div className="transaction-item__icon">🍕</div>
                <div className="transaction-item__content">
                  <div className="transaction-item__merchant">
                    Panera
                    <span className="badge badge--category food">RESTAURANTS</span>
                  </div>
                  <div className="transaction-item__category">Food & Dining</div>
                </div>
                <div className="transaction-item__amount">$15.30</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-item__icon">📺</div>
                <div className="transaction-item__content">
                  <div className="transaction-item__merchant">
                    Apple TV+
                    <span className="badge badge--category entertainment">APPLE TV+</span>
                  </div>
                  <div className="transaction-item__category">Entertainment</div>
                </div>
                <div className="transaction-item__amount">$13.00</div>
              </div>
            </div>

            <div className="transaction-group">
              <div className="transaction-group__header">
                <span className="transaction-group__date">YESTERDAY</span>
                <span className="transaction-group__total">$168.30</span>
              </div>

              <div className="transaction-item">
                <div className="transaction-item__icon">🏪</div>
                <div className="transaction-item__content">
                  <div className="transaction-item__merchant">
                    Amazon
                    <span className="badge badge--category shopping">SHOPPING</span>
                  </div>
                  <div className="transaction-item__category">Shopping</div>
                </div>
                <div className="transaction-item__amount">$65.00</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-item__icon">📱</div>
                <div className="transaction-item__content">
                  <div className="transaction-item__merchant">
                    Phone Bill
                    <span className="badge badge--category bills">PHONE</span>
                  </div>
                  <div className="transaction-item__category">Bills & Utilities</div>
                </div>
                <div className="transaction-item__amount">$90.00</div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Form Elements</h2>

          <div className="card">
            <div className={styles.formDemo}>
              <div>
                <label className="label">Text Input</label>
                <input type="text" className="input" placeholder="Enter text..." />
              </div>

              <div>
                <label className="label">Email Input</label>
                <input type="email" className="input" placeholder="you@example.com" />
              </div>

              <div>
                <label className="label">Select Dropdown</label>
                <select className="select">
                  <option>Select an option</option>
                  <option>Food & Dining</option>
                  <option>Transportation</option>
                  <option>Entertainment</option>
                </select>
              </div>

              <div>
                <label className="label">Search</label>
                <div className="search-bar">
                  <div className="search-bar__icon">🔍</div>
                  <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Search transactions..."
                  />
                </div>
              </div>

              <div>
                <label className="label">Error State</label>
                <input
                  type="text"
                  className="input input--error"
                  placeholder="Invalid input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stats Display</h2>

          <div className={styles.statsGrid}>
            <div className="card">
              <div className="stat">
                <div className="stat__label">Safe to Spend</div>
                <div className="stat__value stat__value--large">$1,245.50</div>
                <div className="stat__subtext">Available until next payday</div>
              </div>
            </div>

            <div className="card">
              <div className="stat">
                <div className="stat__label">This Month</div>
                <div className="stat__value">$3,421.00</div>
                <div className="stat__change stat__change--up">↑ $225 vs last month</div>
              </div>
            </div>

            <div className="card">
              <div className="stat">
                <div className="stat__label">Bills Reserved</div>
                <div className="stat__value">$1,820.00</div>
                <div className="stat__subtext">3 bills upcoming</div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Typography</h2>

          <div className="card">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
            <p>
              This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              <a href="#">This is a link</a> and this is <strong>bold text</strong> and{' '}
              <em>italic text</em>.
            </p>
            <p>
              <small>This is small text</small>
            </p>
            <p>
              <code>This is inline code</code>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
