import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { Category } from "@/pages/Category";
import { Cart } from "@/pages/Cart";
import { ProductDetail } from "@/pages/ProductDetail";
import { Checkout } from "@/pages/Checkout";
import { CheckoutSuccess } from "@/pages/CheckoutSuccess";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { AccountDashboard } from "@/pages/account/AccountDashboard";
import { Orders } from "@/pages/Orders";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminProductForm } from "@/pages/admin/AdminProductForm";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminOrderDetail } from "@/pages/admin/AdminOrderDetail";
import { AdminDocs } from "@/pages/admin/AdminDocs";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { Toaster } from "sonner";

export default function App() {
  const { fetchProducts } = useProductStore();
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <Router>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<AccountDashboard />} />
        <Route path="/orders" element={<Orders />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="docs" element={<AdminDocs />} />
        </Route>
      </Routes>
    </Router>
  );
}
