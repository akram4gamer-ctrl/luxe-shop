import { useLocation, Navigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Copy, MessageCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useOrderStore } from '@/store/orderStore';
import { useSettingsStore } from '@/store/settingsStore';

// This would typically come from an environment variable or admin settings
const WECHAT_ID = 'zzSNOzz';

export function CheckoutSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const { getOrderById } = useOrderStore();
  const { settings } = useSettingsStore();
  
  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Layout>
      <Container className="py-16 md:py-24 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 shadow-xl rounded-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black text-white p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/texture/1000/1000')] mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-gold-500 mb-6" />
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">Order Confirmed</h1>
              <p className="text-gray-300 max-w-md mx-auto">
                Thank you for choosing {settings.storeName}. Your order <span className="text-white font-mono">{order.orderNumber}</span> has been successfully reserved.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Instructions */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-medium uppercase tracking-widest mb-6 flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gold-500" />
                  Payment Instructions
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  To complete your purchase and arrange delivery, please complete the payment manually via WeChat.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Step 1</p>
                    <p className="font-medium mb-3">Add our official WeChat account:</p>
                    <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-sm">
                      <span className="font-mono text-lg flex-1 text-center tracking-wider">{WECHAT_ID}</span>
                      <button 
                        onClick={() => handleCopy(WECHAT_ID)}
                        className="p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-sm"
                        title="Copy WeChat ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Step 2</p>
                    <p className="font-medium mb-2">Send us the following details via WeChat:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                      <li>Your Order Number: <span className="font-mono text-black">{order.orderNumber}</span></li>
                      <li>Your Name, Address, and Phone Number</li>
                      <li>Payment proof (screenshot of transfer)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Step 3</p>
                    <p className="font-medium">Transfer the total amount of <span className="text-gold-600">{formatCurrency(order.totalPriceCNY)}</span>.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-6">
                  Your items will be reserved for 24 hours. Once payment is confirmed, we will process your shipment immediately.
                </p>
                <Link to="/shop" className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
                  Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-serif mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 pr-4">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="font-medium">{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-medium mb-8">
                <span>Total Due</span>
                <span className="text-gold-600">{formatCurrency(order.totalPriceCNY)}</span>
              </div>

              <div className="space-y-4 text-sm">
                <h4 className="font-medium uppercase tracking-wider text-gray-900">Shipping Details</h4>
                <div className="text-gray-600 space-y-1">
                  <p>{order.customerName}</p>
                  {order.email && <p>{order.email}</p>}
                  <p>{order.phone}</p>
                  {order.country && <p>{order.country}</p>}
                  {order.city && <p>{order.city}</p>}
                  <p className="whitespace-pre-wrap">{order.address}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Layout>
  );
}
