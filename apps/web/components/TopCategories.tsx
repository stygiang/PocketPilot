'use client';

import Link from 'next/link';
import styles from './TopCategories.module.scss';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  spent: number;
  budget: number;
  color: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Food & Drink',
    icon: '🍔',
    count: 368,
    spent: 1500,
    budget: 1500,
    color: '#f97316',
  },
  {
    id: '2',
    name: 'Restaurants',
    icon: '🍽️',
    count: 84,
    spent: 1200,
    budget: 1200,
    color: '#22c55e',
  },
  {
    id: '3',
    name: 'Groceries',
    icon: '🛒',
    count: 263,
    spent: 2250,
    budget: 2250,
    color: '#ef4444',
  },
  {
    id: '4',
    name: 'Coffee',
    icon: '☕',
    count: 21,
    spent: 650,
    budget: 650,
    color: '#22c55e',
  },
  {
    id: '5',
    name: 'Necessities',
    icon: '🏠',
    count: 645,
    spent: 1000,
    budget: 1000,
    color: '#f97316',
  },
  {
    id: '6',
    name: 'Shopping',
    icon: '🛍️',
    count: 76,
    spent: 1200,
    budget: 1200,
    color: '#22c55e',
  },
  {
    id: '7',
    name: 'Bills',
    icon: '📄',
    count: 40,
    spent: 100,
    budget: 100,
    color: '#3b82f6',
  },
];

export default function TopCategories() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top categories</h2>
        <Link href="/categories" className={styles.link}>
          Categories →
        </Link>
      </div>

      <div className={styles.categoryList}>
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;

          return (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <div className={styles.categoryDetails}>
                    <div className={styles.categoryName}>{category.name}</div>
                    <div className={styles.categoryCount}>{category.count}</div>
                  </div>
                </div>
                <div className={styles.categoryAmounts}>
                  <div className={styles.categorySpent}>
                    ${category.spent.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>

              <div className={styles.categoryBudget}>
                ${category.budget.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
