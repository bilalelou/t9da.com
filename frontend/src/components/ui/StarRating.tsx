'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = interactive ? (hoverRating || rating) : rating;
    
    if (starIndex <= currentRating) {
      return 'text-yellow-400 fill-yellow-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className="flex items-center gap-1">
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxRating)].map((_, index) => {
          const starIndex = index + 1;
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${getStarColor(starIndex)} ${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
              }`}
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => handleStarHover(starIndex)}
            />
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 mr-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;