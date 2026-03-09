// components/AnimatedTabs.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  className?: string;
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ tabs, className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleTabClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex overflow-hidden rounded-t-lg border-gray-200 border-b bg-white">
        {tabs.map((tab, index) => (
          <button
            className={`relative flex-1 px-6 py-4 font-medium text-sm transition-colors duration-200 ${
              activeIndex === index ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            key={tab.id}
            onClick={() => handleTabClick(index)}
            type="button"
          >
            {tab.label}
            {activeIndex === index && (
              <motion.div
                className="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-600"
                initial={false}
                layoutId="activeTab"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative overflow-hidden rounded-b-lg bg-white">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            animate="center"
            className="p-6"
            custom={direction}
            exit="exit"
            initial="enter"
            key={activeIndex}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            variants={variants}
          >
            {tabs[activeIndex]?.content ?? null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTabs;
