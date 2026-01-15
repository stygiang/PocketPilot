'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TransactionFilters.module.scss';
import FilterDropdown from './FilterDropdown';

// Filter data
const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'subscriptions', label: 'Subscriptions', color: '#3b82f6' },
  { value: 'groceries', label: 'Groceries', color: '#22c55e' },
  { value: 'transportation', label: 'Transportation', color: '#f59e0b' },
  { value: 'entertainment', label: 'Entertainment', color: '#a855f7' },
  { value: 'restaurants', label: 'Restaurants', color: '#f97316' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899' },
  { value: 'bills', label: 'Bills', color: '#ef4444' },
  { value: 'income', label: 'Income', color: '#10b981' },
];

const banks = [
  { value: 'all', label: 'All Accounts' },
  { value: 'chase', label: 'Chase ••4521', color: '#0a4abf' },
  { value: 'bofa', label: 'Bank of America ••8832', color: '#c41230' },
  { value: 'wells', label: 'Wells Fargo ••1199', color: '#d71e28' },
  { value: 'amex', label: 'Amex ••3001', color: '#006fcf' },
];

const months = [
  { value: 'all', label: 'All Time' },
  { value: 'jan-2025', label: 'January 2025' },
  { value: 'dec-2024', label: 'December 2024' },
  { value: 'nov-2024', label: 'November 2024' },
  { value: 'oct-2024', label: 'October 2024' },
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
];

const recurringOptions = [
  { value: 'all', label: 'All Transactions' },
  { value: 'recurring', label: 'Recurring Only' },
  { value: 'one-time', label: 'One-time Only' },
];

const reviewStatuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Needs Review' },
  { value: 'reviewed', label: 'Reviewed' },
];

const goals = [
  { value: 'all', label: 'All Goals' },
  { value: 'vacation', label: 'Vacation Fund' },
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'car', label: 'New Car' },
];

const tags = [
  { value: 'all', label: 'All Tags' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
  { value: 'tax-deductible', label: 'Tax Deductible' },
  { value: 'reimbursable', label: 'Reimbursable' },
];

type FilterKey = 'type' | 'category' | 'bank' | 'month' | 'recurring' | 'reviewStatus' | 'goal' | 'tag';

interface FilterState {
  category: string;
  bank: string;
  month: string;
  type: string;
  recurring: string;
  reviewStatus: string;
  goal: string;
  tag: string;
}

export default function TransactionFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    bank: 'all',
    month: 'all',
    type: 'all',
    recurring: 'all',
    reviewStatus: 'all',
    goal: 'all',
    tag: 'all',
  });

  const updateFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownToggle = (key: FilterKey) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== 'all').length;

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      bank: 'all',
      month: 'all',
      type: 'all',
      recurring: 'all',
      reviewStatus: 'all',
      goal: 'all',
      tag: 'all',
    });
    setOpenDropdown(null);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className={styles.filtersContainer}>
      {/* Search Bar Row */}
      <div className={styles.searchRow}>
        {/* Custom Tag-Input Search Bar */}
        <div
          className={styles.tagInputContainer}
          onClick={() => inputRef.current?.focus()}
        >
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          {/* Filter Tags Inside Input - Show when panel is closed */}
          <AnimatePresence>
            {!isExpanded && activeFilterCount > 0 && (
              <>
                {filters.type !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {types.find((t) => t.value === filters.type)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('type', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.category !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {categories.find((c) => c.value === filters.category)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('category', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.bank !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {banks.find((b) => b.value === filters.bank)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('bank', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.month !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {months.find((m) => m.value === filters.month)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('month', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.recurring !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {recurringOptions.find((r) => r.value === filters.recurring)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('recurring', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.reviewStatus !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {reviewStatuses.find((r) => r.value === filters.reviewStatus)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('reviewStatus', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.goal !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {goals.find((g) => g.value === filters.goal)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('goal', 'all'); }}>✕</button>
                  </motion.span>
                )}
                {filters.tag !== 'all' && (
                  <motion.span
                    className={styles.inputTag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout
                  >
                    {tags.find((t) => t.value === filters.tag)?.label}
                    <button onClick={(e) => { e.stopPropagation(); updateFilter('tag', 'all'); }}>✕</button>
                  </motion.span>
                )}
              </>
            )}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="text"
            placeholder={!isExpanded && activeFilterCount > 0 ? "Search..." : "Search transactions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.tagInput}
          />

          {(searchQuery || (!isExpanded && activeFilterCount > 0)) && (
            <button
              className={styles.clearAllInputButton}
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                if (!isExpanded && activeFilterCount > 0) {
                  clearAllFilters();
                }
              }}
            >
              ✕
            </button>
          )}
        </div>

        <motion.button
          className={`${styles.filterToggle} ${isExpanded ? styles.filterToggleActive : ''}`}
          onClick={handleExpandToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
          <motion.span
            className={styles.chevron}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.span>
        </motion.button>
      </div>

      {/* Expandable Filters Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.filtersPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <motion.div
              className={styles.filtersGrid}
              layout
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* Type Filter */}
              <FilterDropdown
                label="Type"
                options={types}
                value={filters.type}
                onChange={(value) => updateFilter('type', value)}
                isOpen={openDropdown === 'type'}
                onToggle={() => handleDropdownToggle('type')}
              />

              {/* Category Filter */}
              <FilterDropdown
                label="Category"
                options={categories}
                value={filters.category}
                onChange={(value) => updateFilter('category', value)}
                isOpen={openDropdown === 'category'}
                onToggle={() => handleDropdownToggle('category')}
              />

              {/* Account/Bank Filter */}
              <FilterDropdown
                label="Account"
                options={banks}
                value={filters.bank}
                onChange={(value) => updateFilter('bank', value)}
                isOpen={openDropdown === 'bank'}
                onToggle={() => handleDropdownToggle('bank')}
              />

              {/* Month Filter */}
              <FilterDropdown
                label="Month"
                options={months}
                value={filters.month}
                onChange={(value) => updateFilter('month', value)}
                isOpen={openDropdown === 'month'}
                onToggle={() => handleDropdownToggle('month')}
              />

              {/* Recurring Filter */}
              <FilterDropdown
                label="Recurring"
                options={recurringOptions}
                value={filters.recurring}
                onChange={(value) => updateFilter('recurring', value)}
                isOpen={openDropdown === 'recurring'}
                onToggle={() => handleDropdownToggle('recurring')}
              />

              {/* Review Status Filter */}
              <FilterDropdown
                label="Review Status"
                options={reviewStatuses}
                value={filters.reviewStatus}
                onChange={(value) => updateFilter('reviewStatus', value)}
                isOpen={openDropdown === 'reviewStatus'}
                onToggle={() => handleDropdownToggle('reviewStatus')}
              />

              {/* Goal Filter */}
              <FilterDropdown
                label="Goal"
                options={goals}
                value={filters.goal}
                onChange={(value) => updateFilter('goal', value)}
                isOpen={openDropdown === 'goal'}
                onToggle={() => handleDropdownToggle('goal')}
              />

              {/* Tag Filter */}
              <FilterDropdown
                label="Tag"
                options={tags}
                value={filters.tag}
                onChange={(value) => updateFilter('tag', value)}
                isOpen={openDropdown === 'tag'}
                onToggle={() => handleDropdownToggle('tag')}
              />
            </motion.div>

            {/* Active Filters & Clear */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  className={styles.activeFiltersRow}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.activeFilterTags}>
                    {filters.type !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {types.find((t) => t.value === filters.type)?.label}
                        <button onClick={() => updateFilter('type', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.category !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {categories.find((c) => c.value === filters.category)?.label}
                        <button onClick={() => updateFilter('category', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.bank !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {banks.find((b) => b.value === filters.bank)?.label}
                        <button onClick={() => updateFilter('bank', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.month !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {months.find((m) => m.value === filters.month)?.label}
                        <button onClick={() => updateFilter('month', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.recurring !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {recurringOptions.find((r) => r.value === filters.recurring)?.label}
                        <button onClick={() => updateFilter('recurring', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.reviewStatus !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {reviewStatuses.find((r) => r.value === filters.reviewStatus)?.label}
                        <button onClick={() => updateFilter('reviewStatus', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.goal !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {goals.find((g) => g.value === filters.goal)?.label}
                        <button onClick={() => updateFilter('goal', 'all')}>✕</button>
                      </motion.span>
                    )}
                    {filters.tag !== 'all' && (
                      <motion.span
                        className={styles.activeFilterTag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {tags.find((t) => t.value === filters.tag)?.label}
                        <button onClick={() => updateFilter('tag', 'all')}>✕</button>
                      </motion.span>
                    )}
                  </div>
                  <button className={styles.clearAllButton} onClick={clearAllFilters}>
                    Clear All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
