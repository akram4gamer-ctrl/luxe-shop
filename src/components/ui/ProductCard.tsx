import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { formatCurrency, getEffectivePrice, getDiscountPercentage } from "@/lib/utils";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  key?: React.Key;
  theme?: 'light' | 'dark';
}

export function ProductCard({ product, theme = 'light' }: ProductCardProps) {
  const isSale = product.isOnSale && product.salePriceCNY != null;
  const effectivePrice = getEffectivePrice(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col relative"
    >
      <Link
        to={`/product/${product.slug}`}
        className={`relative aspect-[4/5] overflow-hidden mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {!product.inStock && (
            <div className="bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
              Sold Out
            </div>
          )}
          {isSale && product.inStock && (
            <div className="bg-gold-600 text-white text-xs px-2 py-1 uppercase tracking-wider font-medium">
              Sale -{getDiscountPercentage(product.originalPriceCNY ?? (product as any).price ?? 0, product.salePriceCNY!)}%
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-col space-y-1">
        <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <Link to={`/product/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <p className={`text-sm ${isSale ? 'text-gold-500 font-semibold' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
            {formatCurrency(effectivePrice)}
          </p>
          {isSale && (
            <p className="text-xs text-gray-400 line-through">
              {formatCurrency(product.originalPriceCNY ?? (product as any).price ?? 0)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
