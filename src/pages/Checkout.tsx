import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore, generateOrderNumber, Order } from '@/store/orderStore';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { formatCurrency, getEffectivePrice } from '@/lib/utils';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useCustomerAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const orderNumber = generateOrderNumber();
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: crypto.randomUUID(),
        orderNumber,
        userId: user?.id,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          priceAtPurchase: getEffectivePrice(item.product),
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        totalPriceCNY: getCartTotal(),
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        status: 'pending_payment',
        statusHistory: [
          { status: 'pending_payment', timestamp: now, note: 'Order created' }
        ],
        createdAt: now,
      };

      addOrder(newOrder);
      clearCart();
      navigate('/checkout/success', { state: { orderId: newOrder.id } });
    } catch (error) {
      console.error("Failed to create order", error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <Container className="py-24 text-center">
          <h1 className="text-3xl font-serif mb-6">Your cart is empty</h1>
          <Link to="/shop" className={buttonVariants()}>Return to Shop</Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="p-2 text-gray-500 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-serif tracking-tight">Secure Checkout</h1>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form Section */}
          <div className="flex-1">
            <h2 className="text-xl font-medium uppercase tracking-widest mb-8">Shipping Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors bg-white"
                    placeholder="+86 123 4567 8900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors resize-y bg-white"
                  placeholder="Street address, City, Province, Postal Code"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors resize-y bg-white"
                  placeholder="Special instructions for delivery"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 p-8 rounded-sm sticky top-32">
              <h2 className="text-xl font-serif mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">{formatCurrency(getEffectivePrice(item.product) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-medium mb-8">
                <span>Total</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              
              <Button 
                type="submit" 
                form="checkout-form"
                size="lg" 
                className="w-full text-base uppercase tracking-widest h-14"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </Button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure manual payment process</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
