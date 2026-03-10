import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getEffectivePrice(product: Product): number {
  if (product.isOnSale && product.salePriceCNY != null) {
    return product.salePriceCNY;
  }
  return product.originalPriceCNY ?? (product as any).price ?? 0;
}

export function getDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
