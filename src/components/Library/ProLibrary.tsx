import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  Search,
  BookOpen,
  Film,
  Gamepad2,
  Tv,
  Book,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  ArrowRight
} from "lucide-react";
import MediaPreviewModal from "./MediaPreviewModal";
import AddMediaSearchModal from "../modals/AddMediaSearchModal";
import { ManualAddModal } from "./ManualAddModal";
import { MediaItem } from "../../App";

interface ProLibraryProps {
  featured?: MediaItem[];
  recent?: MediaItem[];
  topRated?: MediaItem[];
  collection?: MediaItem[];
}

const ProLibrary: React.FC<ProLibraryProps> = ({
  featured = [],
  recent = [],
  topRated = [],
  collection = [],
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showAddSearchModal, setShowAddSearchModal] = useState(false);
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Get category icon
  const getCategoryIcon = (type: string, className: string = "w-4 h-4") => {
    switch (type?.toLowerCase()) {
      case "game":
      case "games":
        return <Gamepad2 className={className} />;
      case "book":
      case "books":
        return <BookOpen className={className} />;
      case "movie":
      case "movies":
        return <Film className={className} />;
      case "tv":
      case "series":
        return <Tv className={className} />;
      default:
        return <Book className={className} />;
    }
  };

  // Filter collection
  const filteredCollection = collection.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || item.type?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Get best rated book
  const bestBook = featured.length > 0
    ? featured[0]
    : collection.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Modern Header */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">My Books</h1>
                <p className="text-xs text-slate-400">{collection.length} itens</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search book name, author, edition..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddSearchModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Add Media
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-2">
            {[
              { id: "all", label: "All", icon: null },
              { id: "book", label: "Books", icon: BookOpen },
              { id: "game", label: "Games", icon: Gamepad2 },
              { id: "movie", label: "Movies", icon: Film },
              { id: "tv", label: "TV Shows", icon: Tv },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm font-medium ${
                    filter === category.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8 space-y-12">
        {/* Hero Banner Carousel */}
        {featured.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              {/* Background with blur */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
                style={{
                  backgroundImage: `url(${featured[0]?.cover || ""})`,
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex items-center px-12">
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Featured Collection</span>
                  </div>

                  <h2 className="text-5xl font-bold text-white leading-tight">
                    Keep the story going..
                  </h2>

                  <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                    Continue exploring the stories you love. Don't stop reading your list books and immerse yourself in the world of literature.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardClick(featured[0])}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 rounded-xl font-medium border border-white/10 hover:border-white/20 transition-all inline-flex items-center gap-2"
                  >
                    Start reading
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Featured Books Carousel */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-4">
                  {featured.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onClick={() => handleCardClick(item)}
                      className="cursor-pointer"
                      style={{
                        transform: `perspective(1000px) rotateY(${-10 + index * 2}deg)`,
                        zIndex: 5 - index,
                      }}
                    >
                      <div className="w-44 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 hover:border-violet-500/50 transition-all">
                        {item.cover ? (
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Best Book */}
          {bestBook && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Best Book
                </h3>
                <button className="text-sm text-violet-400 hover:text-violet-300">
                  VIEW MORE
                </button>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCardClick(bestBook)}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-violet-500/50 transition-all"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
                    {bestBook.cover ? (
                      <img
                        src={bestBook.cover}
                        alt={bestBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <h4 className="text-lg font-bold text-white line-clamp-2">
                      {bestBook.title}
                    </h4>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round((bestBook.rating || 0) / 2)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-4">
                      {bestBook.notes || "This is one of your top-rated books. Continue your reading journey with this amazing story."}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-sm font-medium"
                    >
                      READ MORE
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

          {/* Right Column - Popular */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Popular
              </h3>
              <button className="text-sm text-violet-400 hover:text-violet-300">
                ALL BOOKS
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {topRated.slice(0, 8).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCardClick(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-violet-500/20 transition-all">
                    <div className="aspect-[2/3] relative">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          {getCategoryIcon(item.type, "w-8 h-8 text-slate-600")}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {item.rating && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-white">
                            {item.rating}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(item.type, "w-3 h-3 text-violet-400")}
                          <span className="text-xs text-violet-400 capitalize">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Full Collection Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              My Collection
            </h3>
            <div className="text-sm text-slate-400">
              {filteredCollection.length} / {collection.length} books
            </div>
          </div>

          {filteredCollection.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
              {filteredCollection.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => handleCardClick(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-500/20 transition-all">
                    <div className="aspect-[2/3] relative">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          {getCategoryIcon(item.type, "w-8 h-8 text-slate-600")}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                        <h4 className="text-sm font-semibold text-white line-clamp-2">
                          {item.title}
                        </h4>
                      </div>

                      {item.rating && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-white">
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-slate-500" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                No books found
              </h4>
              <p className="text-slate-400 mb-6">
                {search
                  ? "Try adjusting your search"
                  : "Start building your collection"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddSearchModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-medium"
              >
                Add Your First Book
              </motion.button>
            </div>
          )}
        </motion.section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddSearchModal && (
          <AddMediaSearchModal onClose={() => setShowAddSearchModal(false)} />
        )}
        {showManualAddModal && (
          <ManualAddModal onClose={() => setShowManualAddModal(false)} />
        )}
        {isPreviewOpen && selectedItem && (
          <MediaPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            item={selectedItem}
            onEdit={(item) => console.log("Edit:", item)}
            onDelete={(item) => console.log("Delete:", item)}
            onToggleFavorite={(item) => console.log("Favorite:", item)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProLibrary;
