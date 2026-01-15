'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './SideNavigation.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface SubItem {
  label: string;
  value: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
  subItems?: SubItem[];
}

const navigationSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
      { label: 'Transactions', href: '/transactions', icon: '💳' },
      { label: 'Accounts', href: '/accounts', icon: '🏦' },
      { label: 'Investments', href: '/investments', icon: '📈' },
      { label: 'Categories', href: '/categories', icon: '🏷️' },
      { label: 'Recurrings', href: '/recurrings', icon: '🔄' },
    ],
  },
  {
    title: 'Credit cards',
    items: [
      { label: 'American Express', href: '/cards/amex', icon: '💳' },
      { label: 'Cash Rewards', href: '/cards/cash-rewards', icon: '💳' },
    ],
    subItems: [
      { label: 'Depository', value: '$832' },
      { label: 'Investment', value: '$1,594' },
    ],
  },
  {
    items: [
      { label: 'Explore', href: '/explore', icon: '🔍' },
      { label: 'Get help', href: '/help', icon: '❓' },
      { label: 'Settings', href: '/settings', icon: '⚙️' },
    ],
  },
];

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.sideNav}>
      <Link href="/dashboard" className={styles.logo}>
        <Image
          src="/pocketPilot darkmode.png"
          alt="PocketPilot"
          width={160}
          height={40}
          className={styles.logoImage}
          priority
        />
      </Link>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.navContent}>
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.navSection}>
            {section.title && (
              <div className={styles.sectionTitle}>
                <span>{section.title}</span>
                <button className={styles.expandBtn}>▶</button>
              </div>
            )}

            <ul className={styles.navList}>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navItem} ${
                        isActive ? styles.navItemActive : ''
                      }`}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {section.subItems && (
              <ul className={styles.subList}>
                {section.subItems.map((subItem) => (
                  <li key={subItem.label} className={styles.subItem}>
                    <button className={styles.subItemBtn}>
                      <span className={styles.subItemIcon}>▶</span>
                      <span className={styles.subItemLabel}>{subItem.label}</span>
                    </button>
                    <span className={styles.subItemValue}>{subItem.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
