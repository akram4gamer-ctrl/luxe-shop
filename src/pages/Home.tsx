import { Layout } from "@/components/layout/Layout";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { settings } = useSettingsStore();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage}
            alt="Hero background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#050505]"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto text-white"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 font-light">
            {settings.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto font-light">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {categories.slice(0, 2).map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={buttonVariants({ 
                  variant: index === 0 ? "primary" : "outline",
                  size: "lg",
                  className: index !== 0 ? "border-white/30 text-white hover:bg-white hover:text-black" : ""
                })}
              >
                Shop {category.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b border-white/5 bg-[#0a0a0a] text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-gold-500" />
              <h3 className="font-medium uppercase tracking-widest text-sm">
                Authenticity Guaranteed
              </h3>
              <p className="text-sm text-gray-400">
                100% genuine luxury products
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Truck className="w-8 h-8 text-gold-500" />
              <h3 className="font-medium uppercase tracking-widest text-sm">
                Complimentary Shipping
              </h3>
              <p className="text-sm text-gray-400">Free worldwide delivery</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Clock className="w-8 h-8 text-gold-500" />
              <h3 className="font-medium uppercase tracking-widest text-sm">
                24/7 Concierge
              </h3>
              <p className="text-sm text-gray-400">
                Dedicated customer support
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Category Showcase */}
      <section className="py-24 bg-[#050505]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative h-[400px] overflow-hidden group"
              >
                <img
                  src={
                    category.slug === 'perfumes' ? 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800' :
                    category.slug === 'watches' ? 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800' :
                    category.slug === 'bags' ? 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' :
                    category.slug === 'glasses' ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' :
                    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h2 className="text-4xl font-serif mb-4 font-light">{category.name}</h2>
                  <p className="mb-8 max-w-sm text-gray-300">{category.description}</p>
                  <Link
                    to={`/category/${category.slug}`}
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white/50 pb-1 hover:text-gold-300 hover:border-gold-300 transition-colors"
                  >
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Shop by Department */}
      <section className="py-24 bg-[#0a0a0a] text-white border-b border-white/5">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif tracking-tight mb-4 font-light">
              Shop by Department
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our curated collections tailored for him and her.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800"
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-12 text-center">
                <h2 className="text-4xl font-serif mb-4 font-light">For Him</h2>
                <Link
                  to="/shop?gender=male"
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white/50 pb-1 hover:text-gold-300 hover:border-gold-300 transition-colors"
                >
                  Shop Men's <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800"
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-12 text-center">
                <h2 className="text-4xl font-serif mb-4 font-light">For Her</h2>
                <Link
                  to="/shop?gender=female"
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white/50 pb-1 hover:text-gold-300 hover:border-gold-300 transition-colors"
                >
                  Shop Women's <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#0a0a0a] text-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif tracking-tight mb-2 font-light">
                Featured Collection
              </h2>
              <p className="text-gray-400">
                Handpicked selections for the discerning individual.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:block text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-gold-500 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="dark-product-card">
                <ProductCard product={product} theme="dark" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link
              to="/shop"
              className={buttonVariants({
                variant: "outline",
                className: "w-full border-white/20 text-white hover:bg-white hover:text-black",
              })}
            >
              View All
            </Link>
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#050505] text-white text-center border-t border-white/5">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif mb-4">Join The Inner Circle</h2>
            <p className="text-gray-400 mb-8">
              Subscribe to receive exclusive access to limited editions, private
              sales, and new arrivals.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border border-white/20 px-6 py-4 outline-none focus:border-gold-500 transition-colors w-full sm:w-auto flex-1"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
