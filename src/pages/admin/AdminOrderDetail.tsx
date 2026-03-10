import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrderStore, OrderStatus } from '@/store/orderStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Package, Truck, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending Payment',
  paid_processing: 'Paid & Processing',
  in_shipping: 'In Shipping',
  arrived_waiting_pickup: 'Arrived / Waiting Pickup',
  completed: 'Completed',
};

const STATUS_FLOW: OrderStatus[] = [
  'pending_payment',
  'paid_processing',
  'in_shipping',
  'arrived_waiting_pickup',
  'completed'
];

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, updateOrderTracking, updateAdminNotes } = useOrderStore();
  
  const order = id ? getOrderById(id) : undefined;

  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    if (order) {
      setTrackingNumber(order.trackingNumber || '');
      setAdminNotes(order.adminNotes || '');
    }
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Button onClick={() => navigate('/admin/orders')} variant="outline">Back to Orders</Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (window.confirm(`Are you sure you want to change status to ${STATUS_LABELS[newStatus]}?`)) {
      updateOrderStatus(order.id, newStatus, statusNote || `Status updated to ${STATUS_LABELS[newStatus]}`);
      setStatusNote('');
      toast.success('Order status updated');
    }
  };

  const handleSaveTracking = () => {
    updateOrderTracking(order.id, trackingNumber);
    toast.success('Tracking number saved');
  };

  const handleSaveNotes = () => {
    updateAdminNotes(order.id, adminNotes);
    toast.success('Admin notes saved');
  };

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/orders" className="p-2 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-serif flex items-center gap-3">
            Order <span className="font-mono text-gold-600">{order.orderNumber}</span>
          </h2>
          <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Pipeline */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-medium mb-6">Order Status</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_FLOW.map((status, index) => {
                const isPast = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isNext = index === currentStatusIndex + 1;
                
                let btnClass = "px-4 py-2 text-sm border rounded-sm transition-colors ";
                if (isCurrent) btnClass += "bg-black text-white border-black font-medium";
                else if (isPast) btnClass += "bg-gray-100 text-gray-500 border-gray-200";
                else if (isNext) btnClass += "bg-white text-gold-600 border-gold-600 hover:bg-gold-50";
                else btnClass += "bg-white text-gray-400 border-gray-200 opacity-50 cursor-not-allowed";

                return (
                  <button
                    key={status}
                    disabled={!isNext && !isPast}
                    onClick={() => isNext && handleStatusChange(status)}
                    className={btnClass}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 items-start">
              <input 
                type="text" 
                placeholder="Optional note for status change..." 
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                className="flex-1 border border-gray-200 px-3 py-2 text-sm rounded-sm outline-none focus:border-gold-500"
              />
            </div>

            {/* Status History */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Status History</h4>
              <div className="space-y-4">
                {[...order.statusHistory].reverse().map((history, i) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <div className="w-32 text-gray-500 flex-shrink-0">
                      {new Date(history.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{STATUS_LABELS[history.status]}</span>
                      {history.note && <p className="text-gray-500 mt-0.5">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-lg font-medium mb-6">Order Items</h3>
            <div className="space-y-4 divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.productId} className="pt-4 first:pt-0 flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium text-right">
                    {formatCurrency(item.priceAtPurchase * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center text-lg font-medium">
              <span>Total</span>
              <span className="text-gold-600">{formatCurrency(order.totalPriceCNY)}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Customer, Tracking, Notes */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" /> Customer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs mb-1">Name</span>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-1">Phone</span>
                <p>{order.phone}</p>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-1">Shipping Address</span>
                <p className="whitespace-pre-wrap leading-relaxed">{order.address}</p>
              </div>
              {order.notes && (
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Customer Notes</span>
                  <p className="bg-gray-50 p-3 rounded-sm italic text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" /> Tracking Information
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full border border-gray-200 px-3 py-2 text-sm rounded-sm outline-none focus:border-gold-500 font-mono"
              />
              <Button onClick={handleSaveTracking} variant="outline" size="sm" className="w-full">
                <Save className="w-4 h-4 mr-2" /> Save Tracking
              </Button>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Internal Admin Notes
            </h3>
            <div className="space-y-3">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Private notes (not visible to customer)..."
                rows={4}
                className="w-full border border-gray-200 px-3 py-2 text-sm rounded-sm outline-none focus:border-gold-500 resize-none"
              />
              <Button onClick={handleSaveNotes} variant="outline" size="sm" className="w-full">
                <Save className="w-4 h-4 mr-2" /> Save Notes
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
