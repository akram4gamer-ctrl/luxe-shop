import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';

export function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user, isAuthenticated, setAuthModalOpen } = useCustomerAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cart');
      setAuthModalOpen(true);
    }
  }, [isAuthenticated, navigate, setAuthModalOpen]);
  
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: defaultAddress?.country || user?.country || '',
    city: defaultAddress?.city || user?.city || '',
    address: defaultAddress?.address || user?.address || '',
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
      const orderNumber = generateOrderNumber();
      const now = new Date().toISOString();

      // Insert into Supabase
      const supabaseOrders = items.map(item => ({
        customer_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        country: formData.country,
        product_name: item.product.name,
        product_variant: 'Default',
        quantity: item.quantity,
        notes: formData.notes,
        status: 'pending_payment'
      }));

      const { error: supabaseError } = await supabase.from('orders').insert(supabaseOrders);
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

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
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
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

  if (!isAuthenticated) {
    return null;
  }

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
            
            {user?.addresses && user.addresses.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Saved Addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setFormData(prev => ({ ...prev, address: addr.address, city: addr.city, country: addr.country }))}
                      className={`border p-4 rounded-sm cursor-pointer transition-colors ${
                        formData.address === addr.address && formData.city === addr.city && formData.country === addr.country
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300 bg-white'
                      }`}
                    >
                      {addr.isDefault && <span className="text-xs font-medium text-gold-600 mb-1 block">Default</span>}
                      <p className="font-medium text-sm mb-1 text-gray-900">{addr.address}</p>
                      <p className="text-gray-500 text-sm">{addr.city}, {addr.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors bg-white"
                    placeholder="john@example.com"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors bg-white"
                    placeholder="e.g., China, United States"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-gold-500 transition-colors bg-white"
                  placeholder="e.g., Shanghai, Beijing, New York"
                />
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
                  placeholder="Street address, Province, Postal Code"
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
