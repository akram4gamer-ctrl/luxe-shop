import { Layout } from "@/components/layout/Layout";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useCustomerAuthStore } from "@/store/customerAuthStore";
import { formatCurrency, getEffectivePrice } from "@/lib/utils";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

export function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { isAuthenticated, setAuthModalOpen } = useCustomerAuthStore();
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-12">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-gray-50 border border-gray-100 rounded-sm"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Explore
              our collections to find something special.
            </p>
            <Link to="/shop" className={buttonVariants({ size: "lg" })}>
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium uppercase tracking-widest text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const price = item.variant?.priceCNY ?? getEffectivePrice(item.product);
                  return (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  >
                    <div className="col-span-1 md:col-span-6 flex gap-6">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="w-24 h-32 bg-gray-100 flex-shrink-0"
                      >
                        <img
                          src={item.variant?.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="flex flex-col justify-center">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="text-lg font-medium hover:text-gold-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-gray-500 mt-1">
                            Variant: {item.variant.name}
                          </p>
                        )}
                        <p className="text-gray-500 mt-1">
                          {formatCurrency(price)}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                      <span className="md:hidden text-gray-500">Total:</span>
                      <span className="font-medium text-lg">
                        {formatCurrency(price * item.quantity)}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )})}
              </div>
            </div>

            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-gray-50 p-8 rounded-sm">
                <h2 className="text-xl font-serif mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-medium mb-8">
                  <span>Total</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setAuthModalOpen(true);
                    } else {
                      navigate("/checkout");
                    }
                  }}
                  className="w-full inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-900 h-14 px-10 text-base uppercase tracking-widest"
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}
