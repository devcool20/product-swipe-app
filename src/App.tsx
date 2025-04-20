import React, { useState, useRef, useEffect } from 'react';
import { SwipeDirection, Product } from './types/product';
import { mockProducts } from './data/mockProducts';
import CardStack, { CardStackRef } from './components/CardStack';
import Cart from './components/Cart';
import HeartAnimation from './components/HeartAnimation';

function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showHeart, setShowHeart] = useState(false);
  const [allCardsFinished, setAllCardsFinished] = useState(false);
  const cardStackRef = useRef<CardStackRef>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSwipe = (direction: SwipeDirection, product: Product) => {
    switch (direction) {
      case 'right':
        console.log(`Liked Product ID: ${product.id}`);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
        break;
      case 'left':
        console.log(`Passed Product ID: ${product.id}`);
        break;
      case 'up':
        console.log(`Add to cart Product ID: ${product.id}`);
        setCartItems(prev => {
          if (!prev.some(item => item.id === product.id)) {
            return [...prev, product];
          }
          return prev;
        });
        break;
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    setCartItems(prev => prev.filter(item => item.id !== product.id));
  };

  const debouncedClick = (handler: (e: React.MouseEvent | React.TouchEvent) => void) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isClicking) return;
      
      setIsClicking(true);
      handler(e);
      
      setTimeout(() => {
        setIsClicking(false);
      }, 300);
    };
  };

  const handleDislikeClick = debouncedClick((e: React.MouseEvent | React.TouchEvent) => {
    cardStackRef.current?.triggerSwipe('left');
  });

  const handleLikeClick = debouncedClick((e: React.MouseEvent | React.TouchEvent) => {
    cardStackRef.current?.triggerSwipe('right');
  });

  const handleRefresh = debouncedClick((e: React.MouseEvent | React.TouchEvent) => {
    cardStackRef.current?.resetToStart();
    setAllCardsFinished(false);
  });

  const handleCardsFinished = () => {
    setAllCardsFinished(true);
  };

  return (
    <div className="fixed inset-0 bg-[#ffebee] overflow-hidden">
      <div className="relative h-full flex flex-col">
        <h1 className="text-3xl font-bold text-center text-[#d32f2f] pt-6 pb-4">
          Product Swipe
        </h1>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-[500px] px-4 h-[calc(100%-200px)]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 shadow-lg h-full border-2 border-[#ffcdd2]">
              <CardStack 
                ref={cardStackRef} 
                products={mockProducts} 
                onSwipe={handleSwipe}
                onCardsFinished={handleCardsFinished}
              />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 bottom-24 flex justify-center items-center gap-12 z-[9999]">
          <button
            type="button"
            onClick={handleDislikeClick}
            onTouchStart={handleDislikeClick}
            className="bg-[#d32f2f] w-16 h-16 rounded-full shadow-xl hover:bg-[#b71c1c] active:bg-[#9a0007] transition-colors duration-150 flex items-center justify-center touch-manipulation select-none"
            aria-label="Dislike"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {allCardsFinished ? (
            <button
              type="button"
              onClick={handleRefresh}
              onTouchStart={handleRefresh}
              className="bg-[#d32f2f] w-16 h-16 rounded-full shadow-xl hover:bg-[#b71c1c] active:bg-[#9a0007] transition-colors duration-150 flex items-center justify-center touch-manipulation select-none"
              aria-label="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLikeClick}
              onTouchStart={handleLikeClick}
              className="bg-[#d32f2f] w-16 h-16 rounded-full shadow-xl hover:bg-[#b71c1c] active:bg-[#9a0007] transition-colors duration-150 flex items-center justify-center touch-manipulation select-none"
              aria-label="Like"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <HeartAnimation show={showHeart} />
      <div className="fixed bottom-0 left-0 right-0 z-[90]">
        <Cart items={cartItems} onRemove={handleRemoveFromCart} />
      </div>
    </div>
  );
}

export default App;
