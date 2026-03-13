import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { useOrderStore } from '@/store/orderStore';
import { supabase } from '@/lib/supabase';
import { Package, Loader2, ArrowRight, Copy, ExternalLink, Info } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { OrderStatus } from '@/store/orderStore';
import { toast } from 'sonner';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending Payment',
  paid_processing: 'Processing',
  in_shipping: 'In Shipping',
  arrived_waiting_pickup: 'Waiting Pickup',
  completed: 'Completed',
  cancelled: 'Denied / Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid_processing: 'bg-blue-100 text-blue-800',
  in_shipping: 'bg-purple-100 text-purple-800',
  arrived_waiting_pickup: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function Orders() {
  const { user, isAuthenticated } = useCustomerAuthStore();
  const storeOrders = useOrderStore(state => state.orders);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchOrders();
    }
  }, [isAuthenticated, user, storeOrders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('email', user?.email)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        // Fallback to local store if Supabase returns empty (e.g. due to RLS)
        const localOrders = storeOrders.filter(o => o.userId === user?.id);
        const mappedLocalOrders = localOrders.flatMap(order => 
          order.items.map((item, index) => ({
            id: `${order.id}-${index}`,
            created_at: order.createdAt,
            customer_name: order.customerName,
            product_name: item.productName,
            product_variant: item.variantName || 'Default',
            quantity: item.quantity,
            status: order.status,
            tracking_number: order.trackingNumber,
            email: order.email,
          }))
        );
        // Sort by created_at descending
        mappedLocalOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(mappedLocalOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setIsLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Order number copied to clipboard!');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-gold-600" />
            <h1 className="text-3xl font-serif tracking-tight">My Orders</h1>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {isLoading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 border border-gray-100 rounded-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-serif mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gold-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Placed</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="font-mono font-medium">{String(order.id).split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status as OrderStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_LABELS[order.status as OrderStatus] || order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-24 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{order.product_name}</h3>
                      {order.product_variant && order.product_variant !== 'Default' && (
                        <p className="text-gray-500 text-sm mb-1">Variant: {order.product_variant}</p>
                      )}
                      <p className="text-gray-500 text-sm mb-2">Qty: {order.quantity}</p>
                      
                      {order.tracking_number && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-sm inline-block">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Number</p>
                          <p className="font-mono font-medium">{order.tracking_number}</p>
                        </div>
                      )}

                      {order.status !== 'pending_payment' && order.status !== 'cancelled' && (
                        <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-lg p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">How to track your order</h4>
                              <p className="text-sm text-blue-800/80 mt-1">
                                Follow these steps to get real-time tracking updates. We will also inform you when it arrives.
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 ml-8">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                              <p className="text-sm text-gray-700">Copy your order number:</p>
                              <button 
                                onClick={() => handleCopy(String(order.id).split('-')[0].toUpperCase())}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-mono font-medium hover:bg-gray-50 transition-colors"
                              >
                                {String(order.id).split('-')[0].toUpperCase()}
                                <Copy className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                              <p className="text-sm text-gray-700">Go to our tracking portal and paste it in the chat:</p>
                              <a 
                                href="https://95543.qiyukf.com/client?k=51551590dbef83c8b969e4726877a5d1&wp=1&robotShuntSwitch=1&robotId=75059&t=%e7%94%b3%e9%80%9a%e5%ae%98%e7%bd%91" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                Track Order
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}
