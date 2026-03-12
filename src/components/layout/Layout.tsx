import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { AuthModal } from "../auth/AuthModal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Navbar />
      <CartDrawer />
      <AuthModal />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
}
