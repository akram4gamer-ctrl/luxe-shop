import { Category, Product } from "../types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Perfumes",
    slug: "perfumes",
    description: "Exclusive luxury fragrances.",
  },
  {
    id: "cat-2",
    name: "Watches",
    slug: "watches",
    description: "Timeless premium timepieces.",
  },
];

export const products: Product[] = [
  // Perfumes
  {
    id: "p-1",
    name: "Oud Noir",
    slug: "oud-noir",
    description:
      "A deep, woody fragrance with notes of rare agarwood and dark spices.",
    originalPriceCNY: 2450,
    salePriceCNY: 1950,
    isOnSale: true,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
    featured: true,
  },
  {
    id: "p-2",
    name: "Rose de Mai",
    slug: "rose-de-mai",
    description:
      "A delicate and romantic blend of fresh morning roses and subtle amber.",
    originalPriceCNY: 1850,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
  },
  {
    id: "p-3",
    name: "Citrus Vetiver",
    slug: "citrus-vetiver",
    description:
      "Crisp Italian citrus balanced with earthy vetiver and cedarwood.",
    originalPriceCNY: 1600,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
  },
  {
    id: "p-4",
    name: "Midnight Jasmine",
    slug: "midnight-jasmine",
    description: "An intoxicating floral scent blooming under the moonlight.",
    originalPriceCNY: 2100,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1615397323282-312b6951fa62?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
  },
  {
    id: "p-5",
    name: "Santal Supreme",
    slug: "santal-supreme",
    description: "Creamy sandalwood enriched with warm vanilla and musk.",
    originalPriceCNY: 2800,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
    featured: true,
  },
  {
    id: "p-6",
    name: "Aqua Marine",
    slug: "aqua-marine",
    description:
      "A refreshing aquatic fragrance capturing the essence of the ocean.",
    originalPriceCNY: 1450,
    categoryId: "cat-1",
    images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"],
    inStock: false,
  },
  // Watches
  {
    id: "w-1",
    name: "Chronograph Elite",
    slug: "chronograph-elite",
    description:
      "A masterpiece of precision engineering with a sapphire crystal dial.",
    originalPriceCNY: 45000,
    categoryId: "cat-2",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
    featured: true,
  },
  {
    id: "w-2",
    name: "Classic Minimalist",
    slug: "classic-minimalist",
    description:
      "Understated elegance featuring an ultra-thin case and leather strap.",
    originalPriceCNY: 12500,
    salePriceCNY: 9900,
    isOnSale: true,
    categoryId: "cat-2",
    images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
  },
  {
    id: "w-3",
    name: "Diver Pro",
    slug: "diver-pro",
    description:
      "Built for the depths, water-resistant up to 300 meters with luminous hands.",
    originalPriceCNY: 32000,
    categoryId: "cat-2",
    images: ["https://images.unsplash.com/photo-1587836374828-cb4387df3eb7?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
  },
  {
    id: "w-4",
    name: "Tourbillon Grand",
    slug: "tourbillon-grand",
    description:
      "The pinnacle of watchmaking, featuring an exposed tourbillon mechanism.",
    originalPriceCNY: 185000,
    categoryId: "cat-2",
    images: ["https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800"],
    inStock: true,
    featured: true,
  },
];
