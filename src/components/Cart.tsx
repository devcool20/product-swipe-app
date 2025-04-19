import React, { useState } from 'react';
import { Product } from '../types/product';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  items: Product[];
  onRemove: (product: Product) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ 
        height: isOpen ? '60vh' : '60px',
        y: isOpen ? 0 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-xl rounded-t-2xl overflow-hidden z-50"
    >
      <div 
        className="bg-gray-800 text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">Shopping Cart ({items.length})</h2>
        <motion.button
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-[calc(60vh-60px)] overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="font-bold">${item.currentPrice.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart; 