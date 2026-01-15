'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './FilterDropdown.module.scss';

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  isOpen,
  onToggle,
}: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    onToggle();
  };

  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>

      <div className={styles.dropdownWrapper}>
        <motion.button
          className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownTriggerOpen : ''}`}
          onClick={onToggle}
          whileTap={{ scale: 0.98 }}
        >
          <span className={styles.selectedValue}>
            {selectedOption?.color && (
              <span
                className={styles.colorDot}
                style={{ backgroundColor: selectedOption.color }}
              />
            )}
            {selectedOption?.label || 'Select...'}
          </span>
          <motion.span
            className={styles.chevron}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.optionsList}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className={styles.optionsContent}>
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    className={`${styles.option} ${value === option.value ? styles.optionSelected : ''}`}
                    onClick={() => handleSelect(option.value)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.color && (
                      <span
                        className={styles.colorDot}
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className={styles.optionLabel}>{option.label}</span>
                    {value === option.value && (
                      <motion.span
                        className={styles.checkmark}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
