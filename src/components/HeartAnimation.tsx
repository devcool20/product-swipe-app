import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartAnimationProps {
  show: boolean;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 0.5 }}
            className="text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-32 w-32"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartAnimation; 