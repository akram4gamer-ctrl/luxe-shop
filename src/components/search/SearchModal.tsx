import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import { formatCurrency, getEffectivePrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { products } = useProductStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const searchResults = query.trim() === "" 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="search-modal" 
          className="fixed inset-0 z-[100] flex flex-col items-center pt-[15vh] px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.05 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <form onSubmit={handleSearch} className="relative flex items-center border-b border-gray-100">
              <Search className="absolute left-5 w-6 h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-transparent py-5 pl-14 pr-14 text-lg outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button 
                type="button"
                onClick={onClose}
                className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {query.trim() !== "" && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col p-2">
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200/50">
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{product.description}</p>
                        </div>
                        <div className="text-right pl-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(getEffectivePrice(product))}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={handleSearch}
                      className="mt-2 w-full p-3 text-center text-sm font-medium text-gold-600 hover:text-gold-700 hover:bg-gold-50 rounded-xl transition-colors"
                    >
                      View all results for "{query}"
                    </button>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    No products found matching "{query}"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
