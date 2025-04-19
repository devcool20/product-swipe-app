import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Product, SwipeDirection } from '../types/product';
import ProductCard from './ProductCard';

interface CardStackProps {
  products: Product[];
  onSwipe?: (direction: SwipeDirection, product: Product) => void;
  onCardsFinished?: () => void;
}

export interface CardStackRef {
  triggerSwipe: (direction: SwipeDirection) => void;
  resetToStart: () => void;
}

const CardStack = forwardRef<CardStackRef, CardStackProps>(({ products, onSwipe, onCardsFinished }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  const [exitY, setExitY] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  useEffect(() => {
    x.set(0);
    y.set(0);
    setExitX(null);
    setExitY(null);
  }, [currentIndex, x, y]);

  useEffect(() => {
    if (currentIndex >= products.length && onCardsFinished) {
      onCardsFinished();
    }
  }, [currentIndex, products.length, onCardsFinished]);

  const resetToStart = useCallback(() => {
    setCurrentIndex(0);
    x.set(0);
    y.set(0);
    setExitX(null);
    setExitY(null);
  }, [x, y]);

  const performSwipe = useCallback((direction: SwipeDirection) => {
    if (currentIndex >= products.length) return;

    let tempExitX: number | null = null;
    let tempExitY: number | null = null;

    switch (direction) {
      case 'right':
        tempExitX = 1000;
        break;
      case 'left':
        tempExitX = -1000;
        break;
      case 'up':
        tempExitY = -1000;
        break;
    }

    setExitX(tempExitX);
    setExitY(tempExitY);
    if (onSwipe) {
      onSwipe(direction, products[currentIndex]);
    }
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, products, onSwipe]);

  useImperativeHandle(ref, () => ({
    triggerSwipe: (direction: SwipeDirection) => {
      performSwipe(direction);
    },
    resetToStart
  }), [performSwipe, resetToStart]);

  const handleDragEnd = useCallback((
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const xOffset = info.offset.x;
    const yOffset = info.offset.y;
    const xVelocity = info.velocity.x;
    const yVelocity = info.velocity.y;
    const swipeThreshold = 50;
    const velocityThreshold = 300;
    let direction: SwipeDirection | null = null;

    if (Math.abs(xOffset) > Math.abs(yOffset) && (Math.abs(xOffset) > swipeThreshold || Math.abs(xVelocity) > velocityThreshold)) {
      if (xOffset > 0 || xVelocity > velocityThreshold) {
        direction = 'right';
      } else {
        direction = 'left';
      }
    } else if (Math.abs(yOffset) > Math.abs(xOffset) && (Math.abs(yOffset) > swipeThreshold || Math.abs(yVelocity) > velocityThreshold)) {
      if (yOffset < 0 || yVelocity < -velocityThreshold) {
        direction = 'up';
      }
    }

    if (direction) {
      performSwipe(direction);
    }
  }, [performSwipe]);

  const cardVariants = {
    initial: (index: number) => ({
      scale: 1 - index * 0.05,
      translateY: index * 4,
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
    }),
    center: (index: number) => ({
      scale: 1 - index * 0.05,
      translateY: index * 4,
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: { duration: 0.15, ease: "easeOut" }
    }),
    exit: {
      x: exitX || 0,
      y: exitY || 0,
      rotate: exitX ? Math.sign(exitX) * 25 : 0,
      opacity: 0,
      transition: { duration: 0.15, ease: "easeOut" }
    }
  };

  if (currentIndex >= products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-[#4a4a4a] mb-4">No more products to show</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center touch-none">
      <div className="relative w-full h-full">
        <AnimatePresence mode="popLayout">
          {products.slice(currentIndex, currentIndex + 3).reverse().map((product, relativeIndexFromEnd) => {
            const displayIndex = products.slice(currentIndex, currentIndex + 3).length - 1 - relativeIndexFromEnd;
            const isTopCard = displayIndex === 0;

            return (
              <motion.div
                key={product.id}
                style={{
                  x: isTopCard ? x : undefined,
                  y: isTopCard ? y : undefined,
                  rotate: isTopCard ? rotate : undefined,
                  zIndex: relativeIndexFromEnd,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'bottom center',
                  touchAction: 'none'
                }}
                drag={isTopCard}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
                custom={displayIndex}
                variants={cardVariants}
                initial="initial"
                animate="center"
                exit="exit"
                whileDrag={isTopCard ? { scale: 1.02 } : {}}
                className="touch-none will-change-transform"
              >
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default CardStack; 