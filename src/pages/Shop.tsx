import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { getEffectivePrice } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

export function Shop() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setIsLoading(true);
    setter(value);
    setTimeout(() => setIsLoading(false), 400);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "newest":
        // Mock newest by reversing
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
  }, [searchQuery, selectedCategory, sortBy, products]);

  return (
    <Layout>
      <div className="bg-gray-50 py-16 mb-12">
        <Container>
          <h1 className="text-4xl font-serif tracking-tight mb-4">
            All Products
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Explore our complete collection of luxury items.
          </p>
        </Container>
      </div>

      <Container className="mb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery, e.target.value)
                  }
                  className="w-full border-b border-gray-200 py-2 pl-8 outline-none focus:border-gold-500 transition-colors bg-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-0 top-3" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Categories
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "all"}
                    onChange={() =>
                      handleFilterChange(setSelectedCategory, "all")
                    }
                    className="accent-gold-500"
                  />
                  <span
                    className={
                      selectedCategory === "all"
                        ? "text-black font-medium"
                        : "text-gray-500"
                    }
                  >
                    All Products
                  </span>
                </label>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() =>
                        handleFilterChange(setSelectedCategory, category.id)
                      }
                      className="accent-gold-500"
                    />
                    <span
                      className={
                        selectedCategory === category.id
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }
                    >
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} Results
              </p>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                className="text-sm border-none outline-none bg-transparent cursor-pointer text-gray-900 font-medium"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/5] mb-4"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-gray-50">
                <h3 className="text-xl font-serif mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-6 text-sm uppercase tracking-widest font-medium border-b border-black pb-1 hover:text-gold-600 hover:border-gold-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
