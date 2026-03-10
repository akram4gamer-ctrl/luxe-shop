import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { getEffectivePrice } from "@/lib/utils";
import { motion } from "motion/react";

export function Category() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isLoading, setIsLoading] = useState(false);

  const category = categories.find((c) => c.slug === slug);

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    setSortBy(value);
    setTimeout(() => setIsLoading(false), 400);
  };

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    let result = products.filter((p) => p.categoryId === category.id);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "newest":
        result.reverse();
        break;
      case "featured":
      default:
        result.sort((a, b) =>
          a.featured === b.featured ? 0 : a.featured ? -1 : 1,
        );
        break;
    }
    return result;
  }, [category, sortBy, products]);

  if (!category) {
    return (
      <Layout>
        <Container className="py-24 text-center">
          <h1 className="text-3xl font-serif">Category not found</h1>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-16 mb-12">
        <Container>
          <h1 className="text-4xl font-serif tracking-tight mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-500 max-w-2xl">{category.description}</p>
          )}
        </Container>
      </div>

      <Container className="mb-24">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            {categoryProducts.length} Products
          </p>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border-none outline-none bg-transparent cursor-pointer text-gray-900 font-medium"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/4"></div>
              </div>
            ))}
          </div>
        ) : categoryProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-gray-50">
            <h3 className="text-xl font-serif mb-2">No products found</h3>
            <p className="text-gray-500">Check back later for new arrivals.</p>
          </div>
        )}
      </Container>
    </Layout>
  );
}
