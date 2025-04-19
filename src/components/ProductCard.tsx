import React from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, style }) => {
  const {
    name,
    brand,
    description,
    image,
    currentPrice,
    originalPrice,
    discountPercentage
  } = product;

  return (
    <div
      className="relative w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden"
      style={style}
    >
      <div className="relative w-full h-[75%] bg-[#faf7f5]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {discountPercentage && (
          <div className="absolute top-4 right-4 bg-[#ff4d6d] text-white px-3 py-1 rounded-full text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 w-full bg-white p-4">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#ff4d6d] mb-1">{brand}</p>
          <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2 line-clamp-1">{name}</h3>
          {description && (
            <p className="text-sm text-[#666] mb-2 line-clamp-1">{description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#4a4a4a]">
              ₹{currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-[#9a9a9a] line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 