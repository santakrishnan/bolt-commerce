// components/features-display.tsx
"use client";

import { cn } from "@tfs-ucmp/ui";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface FeatureCategory {
  name: string;
  features: string[];
}

type ViewMode = "table" | "grid" | "list" | "accordion" | "compact";

interface FeaturesDisplayProps {
  categories: FeatureCategory[];
  maxHeight?: number;
  className?: string;
  defaultView?: ViewMode;
}

interface ViewOption {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

const viewOptions: ViewOption[] = [
  {
    id: "table",
    label: "Table",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <rect height="18" rx="2" width="18" x="3" y="3" />
        <line x1="3" x2="21" y1="9" y2="9" />
        <line x1="3" x2="21" y1="15" y2="15" />
        <line x1="12" x2="12" y1="9" y2="21" />
      </svg>
    ),
  },
  {
    id: "grid",
    label: "Grid",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    id: "list",
    label: "List",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <line x1="8" x2="21" y1="6" y2="6" />
        <line x1="8" x2="21" y1="12" y2="12" />
        <line x1="8" x2="21" y1="18" y2="18" />
        <circle cx="4" cy="6" fill="currentColor" r="1.5" />
        <circle cx="4" cy="12" fill="currentColor" r="1.5" />
        <circle cx="4" cy="18" fill="currentColor" r="1.5" />
      </svg>
    ),
  },
  {
    id: "accordion",
    label: "Accordion",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <rect height="4" rx="1" width="18" x="3" y="3" />
        <rect height="4" rx="1" width="18" x="3" y="10" />
        <rect height="4" rx="1" width="18" x="3" y="17" />
      </svg>
    ),
  },
  {
    id: "compact",
    label: "Compact",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="10" y2="10" />
        <line x1="4" x2="20" y1="14" y2="14" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    ),
  },
];

const CATEGORY_ICONS = ["🛡️", "🪑", "📱", "🚗", "⚡", "✨", "👥"];

const CATEGORY_COLORS = [
  "bg-blue-50 border-blue-200",
  "bg-emerald-50 border-emerald-200",
  "bg-purple-50 border-purple-200",
  "bg-amber-50 border-amber-200",
  "bg-red-50 border-red-200",
  "bg-cyan-50 border-cyan-200",
  "bg-pink-50 border-pink-200",
];

// Helper function to generate unique key for features
const getFeatureKey = (categoryName: string, feature: string, index: number) =>
  `${categoryName}-${feature}-${index}`;

// Table View - Similar to AutoTrader reference
function TableView({ categories }: { categories: FeatureCategory[] }) {
  return (
    <div className="space-y-6">
      {categories.map((category, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-gray-200 border-b pb-4 last:border-b-0"
          initial={{ opacity: 0, y: 10 }}
          key={category.name}
          transition={{ delay: index * 0.05 }}
        >
          <h4 className="mb-3 font-bold text-gray-800 text-lg">{category.name}</h4>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
            {category.features.map((feature, featureIndex) => (
              <div
                className="border-gray-100 border-b py-1 text-gray-600 text-sm last:border-b-0"
                key={getFeatureKey(category.name, feature, featureIndex)}
              >
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Grid View - Card-based layout
function GridView({ categories }: { categories: FeatureCategory[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category, index) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          key={category.name}
          transition={{ delay: index * 0.05 }}
        >
          <div className="bg-[var(--color-brand-surface)] px-4 py-3">
            <h4 className="font-semibold text-[var(--color-brand-text)] text-sm">
              {category.name}
            </h4>
            <span className="text-[var(--color-brand-text)]/70 text-xs">
              {category.features.length} features
            </span>
          </div>
          <ul className="space-y-2 p-4">
            {category.features.map((feature, featureIndex) => (
              <li
                className="flex items-start gap-2 text-gray-700 text-sm"
                key={getFeatureKey(category.name, feature, featureIndex)}
              >
                <span className="mt-0.5 flex-shrink-0 text-green-500">✓</span>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// List View - Simple vertical list with icons
function ListView({ categories }: { categories: FeatureCategory[] }) {
  return (
    <div className="space-y-8">
      {categories.map((category, index) => (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          key={category.name}
          transition={{ delay: index * 0.05 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{CATEGORY_ICONS[index % CATEGORY_ICONS.length]}</span>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">{category.name}</h4>
              <span className="text-gray-500 text-sm">
                {category.features.length} features included
              </span>
            </div>
          </div>
          <div className="ml-10 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {category.features.map((feature, featureIndex) => (
              <div
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-700 text-sm"
                key={getFeatureKey(category.name, feature, featureIndex)}
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Accordion View - Expandable sections
function AccordionView({
  categories,
  expandedCategories,
  toggleCategory,
  expandAllCategories,
  collapseAllCategories,
}: {
  categories: FeatureCategory[];
  expandedCategories: Set<string>;
  toggleCategory: (name: string) => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-end gap-2">
        <button
          className="font-medium text-blue-600 text-xs hover:text-blue-800"
          onClick={expandAllCategories}
          type="button"
        >
          Expand All
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="font-medium text-blue-600 text-xs hover:text-blue-800"
          onClick={collapseAllCategories}
          type="button"
        >
          Collapse All
        </button>
      </div>
      {categories.map((category, index) => {
        const isOpen = expandedCategories.has(category.name);
        return (
          <motion.div
            animate={{ opacity: 1 }}
            className={cn(
              "overflow-hidden rounded-lg border",
              isOpen ? CATEGORY_COLORS[index % CATEGORY_COLORS.length] : "border-gray-200 bg-white"
            )}
            initial={{ opacity: 0 }}
            key={category.name}
            transition={{ delay: index * 0.03 }}
          >
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
              onClick={() => toggleCategory(category.name)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800">{category.name}</span>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-600 text-xs">
                  {category.features.length}
                </span>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="text-gray-500"
                transition={{ duration: 0.2 }}
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 gap-2 px-4 pb-4 md:grid-cols-2">
                    {category.features.map((feature, featureIndex) => (
                      <div
                        className="flex items-center gap-2 rounded bg-white px-3 py-2 text-gray-700 text-sm"
                        key={getFeatureKey(category.name, feature, featureIndex)}
                      >
                        <span className="text-green-500">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// Compact View - Dense tag-based layout
function CompactView({ categories }: { categories: FeatureCategory[] }) {
  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-start gap-2"
          initial={{ opacity: 0 }}
          key={category.name}
          transition={{ delay: index * 0.03 }}
        >
          <span className="min-w-fit rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-gray-800 text-sm">
            {category.name}:
          </span>
          {category.features.map((feature, featureIndex) => (
            <span
              className="cursor-default rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-600 text-sm transition-colors hover:bg-gray-50"
              key={getFeatureKey(category.name, feature, featureIndex)}
            >
              {feature}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

const FeaturesDisplay: React.FC<FeaturesDisplayProps> = ({
  categories,
  maxHeight = 200,
  className = "",
  defaultView = "table",
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHasOverflow(contentHeight > maxHeight);
    }
  }, [maxHeight]);

  useEffect(() => {
    checkOverflow();
    const timeout = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
      clearTimeout(timeout);
    };
  }, [checkOverflow]);

  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryName)) {
        newExpanded.delete(categoryName);
      } else {
        newExpanded.add(categoryName);
      }
      return newExpanded;
    });
  }, []);

  const expandAllCategories = useCallback(() => {
    setExpandedCategories(new Set(categories.map((c) => c.name)));
  }, [categories]);

  const collapseAllCategories = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setIsExpanded(false);
  }, []);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const renderContent = () => {
    switch (viewMode) {
      case "table":
        return <TableView categories={categories} />;
      case "grid":
        return <GridView categories={categories} />;
      case "list":
        return <ListView categories={categories} />;
      case "accordion":
        return (
          <AccordionView
            categories={categories}
            collapseAllCategories={collapseAllCategories}
            expandAllCategories={expandAllCategories}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
          />
        );
      case "compact":
        return <CompactView categories={categories} />;
      default:
        return <TableView categories={categories} />;
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg bg-surface px-[var(--spacing-lg)] py-[var(--spacing-lg)] lg:px-[var(--spacing-xl)] lg:py-[var(--spacing-xl)]",
        className
      )}
    >
      {/* View Mode Switcher */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-gray-200 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-500 text-sm">View:</span>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {viewOptions.map((option) => (
              <button
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200",
                  viewMode === option.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
                key={option.id}
                onClick={() => handleViewModeChange(option.id)}
                type="button"
              >
                {option.icon}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <motion.div
        animate={{
          maxHeight: isExpanded ? 5000 : maxHeight,
        }}
        className="relative overflow-hidden"
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <div ref={contentRef}>{renderContent()}</div>

        {/* Gradient Overlay */}
        <AnimatePresence>
          {hasOverflow && !isExpanded && (
            <motion.div
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expand/Collapse Button */}
      <AnimatePresence>
        {hasOverflow && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex justify-center"
            initial={{ opacity: 0, y: -10 }}
          >
            <button
              className="group flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 transition-colors duration-200 hover:bg-gray-200"
              onClick={handleToggleExpanded}
              type="button"
            >
              <span className="font-medium text-gray-700 text-sm">
                {isExpanded ? "Show Less" : "Show More Features"}
              </span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="text-gray-500 group-hover:text-gray-700"
                transition={{ duration: 0.3 }}
              >
                <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesDisplay;
