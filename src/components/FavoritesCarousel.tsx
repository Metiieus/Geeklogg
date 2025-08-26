import React, { useState, memo } from 'react';
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
      <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <h4 className="text-white font-bold mb-4 sm:mb-6 text-center flex items-center justify-center gap-2 text-sm sm:text-base">
          <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${color} animate-pulse`} />
          {title}
        </h4>
        <div className="text-center text-slate-400 py-8 sm:py-12">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${color.replace('text-', 'bg-').replace('-400', '-500/20')} flex items-center justify-center mx-auto mb-3 border-2 border-dashed ${color.replace('text-', 'border-').replace('-400', '-500/30')} group-hover:scale-110 transition-transform duration-300`}>
            <Star className={`w-6 h-6 sm:w-8 sm:h-8 ${color.replace('-400', '-500')} animate-bounce`} />
          </div>
          <p className="text-sm sm:text-base font-medium">Nenhum favorito ainda</p>
          <p className="text-xs sm:text-sm opacity-70 mt-1">Adicione seus itens favoritos</p>
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
    <div className="bg-gradient-to-br from-slate-800/50 via-slate-800/40 to-slate-900/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative group hover:border-white/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h4 className="text-white font-bold flex items-center gap-2 text-sm sm:text-base bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${color} drop-shadow-lg`} />
          {title}
        </h4>
        <div className="flex items-center gap-2 bg-slate-900/50 rounded-full px-3 py-1">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex
                  ? `${color.replace('text-', 'bg-')} shadow-lg ${color.replace('text-', 'shadow-').replace('-400', '-500/50')}`
                  : 'bg-slate-600 hover:bg-slate-500'
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
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-full text-white hover:from-slate-800/90 hover:to-slate-700/90 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/10 touch-target"
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-full text-white hover:from-slate-800/90 hover:to-slate-700/90 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/10 touch-target"
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Cards container */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={item.id} className="w-full flex-shrink-0 px-2 sm:px-3">
                <div className="bg-gradient-to-br from-slate-700/60 via-slate-800/50 to-slate-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] group/card shadow-lg hover:shadow-2xl backdrop-blur-sm">
                  {/* Image */}
                  <div className="relative w-full h-28 sm:h-36 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 shadow-md">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover/card:scale-110 group-hover/card:brightness-110"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${color.replace('text-', 'text-').replace('-400', '-300')}`}>
                        <Star size={20} className="sm:w-7 sm:h-7 animate-pulse" />
                      </div>
                    )}
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500" />
                    {/* Glow effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-30 transition-opacity duration-500 bg-gradient-to-t ${color.replace('text-', 'from-').replace('-400', '-500/20')} to-transparent`} />
                  </div>

                  {/* Title */}
                  <h5 className="text-white font-semibold text-sm sm:text-base text-center leading-tight line-clamp-2 mb-2 group-hover/card:text-gray-100 transition-colors duration-300">
                    {item.name}
                  </h5>

                  {/* Enhanced decorative elements */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')}`} />
                    <div className={`w-2 h-0.5 bg-gradient-to-r ${color.replace('text-', 'from-').replace('-400', '-500')} to-transparent opacity-60`} />
                    <div className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')}`} />
                  </div>

                  {/* Star rating visual */}
                  <div className="flex justify-center">
                    <Star className={`w-3 h-3 ${color} fill-current opacity-70 group-hover/card:opacity-100 transition-opacity duration-300`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced background effects */}
      <div className={`absolute inset-0 ${color.replace('text-', 'bg-').replace('-400', '-500/5')} rounded-2xl pointer-events-none`} />
      <div className={`absolute -inset-1 ${color.replace('text-', 'bg-').replace('-400', '-500/10')} rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
    </div>
  );
};
