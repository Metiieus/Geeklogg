import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { FavoriteItem } from '../App';

interface FavoritesCarouselProps {
  items: FavoriteItem[];
  title: string;
  color: string;
}

export const FavoritesCarousel: React.FC<FavoritesCarouselProps> = ({ items, title, color }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items.length) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-center flex items-center justify-center gap-2 text-sm sm:text-base">
          <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${color}`} />
          {title}
        </h4>
        <div className="text-center text-slate-400 py-6 sm:py-8">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${color.replace('text-', 'bg-').replace('-400', '-500/20')} flex items-center justify-center mx-auto mb-2`}>
            <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('-400', '-500')}`} />
          </div>
          <p className="text-xs sm:text-sm">Nenhum favorito ainda</p>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 overflow-hidden relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
          <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${color}`} />
          {title}
        </h4>
        <div className="flex items-center gap-1">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? color.replace('text-', 'bg-') : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Cards container */}
        <div className="overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={item.id} className="w-full flex-shrink-0 px-2">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 group/card">
                  {/* Image */}
                  <div className="relative w-full h-32 bg-slate-700 rounded-lg overflow-hidden mb-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${color.replace('text-', 'text-').replace('-400', '-300')}`}>
                        <Star size={24} />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Title */}
                  <h5 className="text-white font-medium text-sm text-center leading-tight">
                    {item.name}
                  </h5>
                  
                  {/* Decorative line */}
                  <div className={`w-full h-0.5 mt-2 bg-gradient-to-r ${color.replace('text-', 'from-').replace('-400', '-500')} to-transparent opacity-50`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background glow effect */}
      <div className={`absolute inset-0 ${color.replace('text-', 'bg-').replace('-400', '-500/5')} rounded-2xl pointer-events-none`} />
    </div>
  );
};
