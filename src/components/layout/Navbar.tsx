import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Package } from "lucide-react";
import { Container } from "../ui/Container";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/store/cartStore";
import { useCustomerAuthStore } from "@/store/customerAuthStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useCategoryStore } from "@/store/categoryStore";
import { SearchModal } from "../search/SearchModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Perfumes", href: "/category/perfumes" },
  { name: "Watches", href: "/category/watches" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { getCartCount, setIsOpen } = useCartStore();
  const { isAuthenticated } = useCustomerAuthStore();
  const { settings } = useSettingsStore();
  const { categories } = useCategoryStore();

  const dynamicNavLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    ...categories.slice(0, 3).map(c => ({ name: c.name, href: `/category/${c.slug}` }))
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-4"
          : "bg-transparent py-6",
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 text-gray-900"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif tracking-widest uppercase font-bold text-gray-900"
          >
            {settings.storeName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {dynamicNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors hover:text-gold-600",
                  location.pathname === link.href
                    ? "text-black font-medium"
                    : "text-gray-500",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-900 hover:text-gold-600 transition-colors hidden sm:block"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to={isAuthenticated ? "/orders" : "/login"}
              className="p-2 text-gray-900 hover:text-gold-600 transition-colors hidden sm:block"
              title="My Orders"
            >
              <Package className="w-5 h-5" />
            </Link>
            <Link 
              to={isAuthenticated ? "/account" : "/login"}
              className="p-2 text-gray-900 hover:text-gold-600 transition-colors hidden sm:block"
              title="My Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-gray-900 hover:text-gold-600 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-xl font-serif tracking-widest uppercase font-bold">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col space-y-6">
                {dynamicNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg uppercase tracking-wider text-gray-900"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-gray-100 space-y-6">
                  <Link
                    to={isAuthenticated ? "/orders" : "/login"}
                    className="flex items-center gap-3 text-lg uppercase tracking-wider text-gray-900"
                  >
                    <Package className="w-5 h-5" />
                    My Orders
                  </Link>
                  <Link
                    to={isAuthenticated ? "/account" : "/login"}
                    className="flex items-center gap-3 text-lg uppercase tracking-wider text-gray-900"
                  >
                    <User className="w-5 h-5" />
                    {isAuthenticated ? "My Account" : "Sign In"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
