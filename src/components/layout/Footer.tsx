import { Container } from "../ui/Container";
import { useSettingsStore } from "@/store/settingsStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Link } from "react-router-dom";

export function Footer() {
  const { settings } = useSettingsStore();
  const { categories } = useCategoryStore();

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-serif tracking-widest uppercase font-bold mb-6">
              {settings.storeName}
            </h2>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed mb-4">
              {settings.storeDescription}
            </p>
            <div className="text-gray-400 text-sm space-y-1">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
              <p>{settings.address}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest font-semibold mb-6">
              Shop
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest font-semibold mb-6">
              Support
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/admin" className="hover:text-white transition-colors">
              Admin Login
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
