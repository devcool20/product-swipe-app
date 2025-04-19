import React, { useState, useRef } from 'react';
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

  const handleDislikeClick = () => {
    cardStackRef.current?.triggerSwipe('left');
  };

  const handleLikeClick = () => {
    cardStackRef.current?.triggerSwipe('right');
  };

  const handleRefresh = () => {
    cardStackRef.current?.resetToStart();
    setAllCardsFinished(false);
  };

  const handleCardsFinished = () => {
    setAllCardsFinished(true);
  };

  return (
    <div className="fixed inset-0 bg-[#fff5f6]">
      {/* Mobile View */}
      <div className="md:hidden relative h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-[400px] px-4">
            <CardStack 
              ref={cardStackRef} 
              products={mockProducts} 
              onSwipe={handleSwipe}
              onCardsFinished={handleCardsFinished}
            />
          </div>
        </div>
        
        {/* Action Buttons - Overlaid on cards */}
        <div className="absolute inset-x-0 bottom-24 flex justify-center items-center gap-12 z-[9999]">
          <button
            type="button"
            onClick={handleDislikeClick}
            className="bg-white w-16 h-16 rounded-full shadow-xl hover:bg-red-50 active:bg-red-100 transition-colors duration-150 flex items-center justify-center touch-manipulation"
            aria-label="Dislike"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff4d6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {allCardsFinished ? (
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-white w-16 h-16 rounded-full shadow-xl hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 flex items-center justify-center touch-manipulation"
              aria-label="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff4d6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLikeClick}
              className="bg-white w-16 h-16 rounded-full shadow-xl hover:bg-green-50 active:bg-green-100 transition-colors duration-150 flex items-center justify-center touch-manipulation"
              aria-label="Like"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4CAF50]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop/Tablet View */}
      <div className="hidden md:block h-full py-8 px-4">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <h1 className="text-3xl font-bold text-center text-[#ff4d6d] mb-8">
            Product Swipe
          </h1>
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 shadow-lg flex-grow flex flex-col relative">
            <div className="flex-grow">
              <CardStack 
                ref={cardStackRef} 
                products={mockProducts} 
                onSwipe={handleSwipe}
                onCardsFinished={handleCardsFinished}
              />
            </div>

            <div className="mt-6 flex justify-center gap-12 relative z-[100]">
              <button
                onClick={handleDislikeClick}
                className="bg-white w-16 h-16 rounded-full shadow-lg hover:bg-red-50 active:bg-red-100 transition-colors duration-150 flex items-center justify-center"
                aria-label="Dislike"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff4d6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {allCardsFinished ? (
                <button
                  onClick={handleRefresh}
                  className="bg-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
                  aria-label="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff4d6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleLikeClick}
                  className="bg-white w-16 h-16 rounded-full shadow-lg hover:bg-green-50 active:bg-green-100 transition-colors duration-150 flex items-center justify-center"
                  aria-label="Like"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4CAF50]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
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
