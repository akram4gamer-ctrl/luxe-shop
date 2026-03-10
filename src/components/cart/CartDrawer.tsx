import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getEffectivePrice } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/Button";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getCartTotal } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif tracking-widest uppercase font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-gray-500">
                    Looks like you haven't added anything yet.
                  </p>
                  <Button onClick={() => setIsOpen(false)} className="mt-4">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-24 h-30 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatCurrency(getEffectivePrice(item.product))}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-sm">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between mb-4 text-lg font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-900 h-14 px-10 text-base"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
