import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/productStore";
import { formatCurrency, getEffectivePrice, getDiscountPercentage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useCustomerAuthStore } from "@/store/customerAuthStore";
import { Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ProductVariant } from "@/types";

export function ProductDetail() {
  const { products } = useProductStore();
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const relatedProducts = products
    .filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id)
    .slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>([]);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { isAuthenticated, setAuthModalOpen } = useCustomerAuthStore();

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariants([product.variants[0]]);
      if (product.variants[0].image) {
        setDisplayImage(product.variants[0].image);
      } else {
        setDisplayImage(product.images[0]);
      }
    } else {
      setSelectedVariants([]);
      if (product) {
        setDisplayImage(product.images[0]);
      }
    }
  }, [product]);

  const handleVariantToggle = (variant: ProductVariant) => {
    const isSelected = selectedVariants.some(v => v.id === variant.id);
    if (isSelected) {
      setSelectedVariants(selectedVariants.filter(v => v.id !== variant.id));
    } else {
      setSelectedVariants([...selectedVariants, variant]);
      if (variant.image) {
        setDisplayImage(variant.image);
      }
    }
  };

  const handleThumbnailClick = (idx: number) => {
    setActiveImage(idx);
    if (product) {
      setDisplayImage(product.images[idx]);
    }
  };

  if (!product) {
    return (
      <Layout>
        <Container className="py-24 text-center">
          <h1 className="text-3xl font-serif">Product not found</h1>
          <Link
            to="/shop"
            className="mt-8 inline-block text-gold-600 hover:underline"
          >
            Return to Shop
          </Link>
        </Container>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (product.variants && product.variants.length > 0) {
      if (selectedVariants.length === 0) {
        toast.error("Please select at least one variant");
        return;
      }
      selectedVariants.forEach(variant => {
        addItem(product, quantity, variant);
      });
      toast.success(`Added ${quantity * selectedVariants.length} items to cart`);
    } else {
      addItem(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
    setIsOpen(true);
  };

  const isSale = product.isOnSale && product.salePriceCNY != null;
  const effectivePrice = selectedVariants.length > 0 ? (selectedVariants[selectedVariants.length - 1].priceCNY ?? getEffectivePrice(product)) : getEffectivePrice(product);
  const isInStock = selectedVariants.length > 0 ? selectedVariants.every(v => v.inStock) : product.inStock;

  return (
    <Layout>
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 overflow-hidden relative group"
            >
              <img
                src={displayImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!isInStock && (
                  <div className="bg-black text-white text-xs px-3 py-1.5 uppercase tracking-wider">
                    Sold Out
                  </div>
                )}
                {isSale && !(selectedVariants.length > 0 && selectedVariants[selectedVariants.length - 1].priceCNY) && (
                  <div className="bg-gold-600 text-white text-xs px-3 py-1.5 uppercase tracking-wider font-medium">
                    Sale -{getDiscountPercentage(product.originalPriceCNY ?? (product as any).price ?? 0, product.salePriceCNY!)}%
                  </div>
                )}
              </div>
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`w-20 h-20 flex-shrink-0 bg-gray-100 border-2 ${
                      displayImage === img
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-serif tracking-tight mb-4">
                {product.name}
              </h1>
              {product.gender && product.gender !== 'unisex' && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 uppercase tracking-widest font-medium rounded-sm">
                    {product.gender === 'male' ? "Men's" : "Women's"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 mb-6">
                <p className={`text-2xl ${isSale && !(selectedVariants.length > 0 && selectedVariants[selectedVariants.length - 1].priceCNY) ? 'text-gold-600 font-semibold' : 'text-gray-900'}`}>
                  {formatCurrency(effectivePrice)}
                </p>
                {isSale && !(selectedVariants.length > 0 && selectedVariants[selectedVariants.length - 1].priceCNY) && (
                  <p className="text-lg text-gray-400 line-through">
                    {formatCurrency(product.originalPriceCNY ?? (product as any).price ?? 0)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span>(12 Reviews)</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase tracking-widest text-gray-900 mb-4">
                  Select Variant(s)
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantToggle(variant)}
                      disabled={!variant.inStock}
                      className={`flex items-center gap-3 px-4 py-2 border text-sm transition-colors ${
                        selectedVariants.some(v => v.id === variant.id)
                          ? "border-black bg-black text-white"
                          : !variant.inStock
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 hover:border-black text-gray-900"
                      }`}
                    >
                      {variant.image && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white">
                          <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium uppercase tracking-widest text-gray-900">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                    disabled={!isInStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                    disabled={!isInStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-lg uppercase tracking-widest"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Authentic
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-gray-100">
            <h2 className="text-2xl font-serif tracking-tight mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}
