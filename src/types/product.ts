export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
}

export type SwipeDirection = 'left' | 'right' | 'up'; 