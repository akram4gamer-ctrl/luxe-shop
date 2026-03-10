export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPriceCNY: number;
  salePriceCNY?: number | null;
  isOnSale?: boolean;
  categoryId: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
};
