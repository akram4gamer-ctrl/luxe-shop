import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { useOrderStore } from '@/store/orderStore';
import { User, Package, MapPin, LogOut, ExternalLink, Truck, Copy } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid_processing: 'Processing',
  in_shipping: 'In Shipping',
  arrived_waiting_pickup: 'Waiting Pickup',
  completed: 'Completed',
  cancelled: 'Denied / Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid_processing: 'bg-blue-100 text-blue-800',
  in_shipping: 'bg-purple-100 text-purple-800',
  arrived_waiting_pickup: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function AccountDashboard() {
  const { user, isAuthenticated, logout } = useCustomerAuthStore();
  const orders = useOrderStore(state => state.orders);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [supabaseData, setSupabaseData] = useState<Record<string, { tracking: string, status: string }>>({});
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const { updateProfile } = useCustomerAuthStore();
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    if (user?.email) {
      fetchOrdersData();
    }
  }, [user]);

  const fetchOrdersData = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
      
      if (data && data.length > 0) {
        console.log("Supabase orders keys:", Object.keys(data[0]));
      }

      const { data: userData, error: userError } = await supabase
        .from('orders')
        .select('created_at, tracking_number, status')
        .eq('email', user?.email);
      
      if (userData && !userError) {
        const dataMap: Record<string, { tracking: string, status: string }> = {};
        userData.forEach(row => {
          const timeKey = new Date(row.created_at).toISOString().substring(0, 16);
          dataMap[timeKey] = {
            tracking: row.tracking_number || '',
            status: row.status || 'pending_payment'
          };
        });
        setSupabaseData(dataMap);
      }
    } catch (err) {
      console.error('Failed to fetch orders data', err);
    }
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied to clipboard!');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddresses = [...(user.addresses || [])];
    
    if (editingAddressId === 'new') {
      newAddresses.push({
        id: crypto.randomUUID(),
        ...addressForm,
        isDefault: newAddresses.length === 0
      });
    } else {
      const index = newAddresses.findIndex(a => a.id === editingAddressId);
      if (index !== -1) {
        newAddresses[index] = { ...newAddresses[index], ...addressForm };
      }
    }

    updateProfile({ addresses: newAddresses });
    setEditingAddressId(null);
    setAddressForm({ address: '', city: '', country: '' });
    toast.success('Address saved successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      let newAddresses = (user.addresses || []).filter(a => a.id !== id);
      if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
        newAddresses[0].isDefault = true;
      }
      updateProfile({ addresses: newAddresses });
      toast.success('Address deleted successfully!');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    const newAddresses = (user.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    updateProfile({ addresses: newAddresses });
    toast.success('Default address updated!');
  };

  const handleEditAddress = (addr: any) => {
    setAddressForm({ address: addr.address, city: addr.city, country: addr.country });
    setEditingAddressId(addr.id);
  };

  const handleAddNewAddress = () => {
    setAddressForm({ address: '', city: '', country: '' });
    setEditingAddressId('new');
  };

  const savedAddresses = user.addresses || [];

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-serif mb-2">My Account</h1>
          <p className="text-gray-500">Welcome back, {user.fullName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-sm transition-colors text-left ${activeTab === 'profile' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-sm transition-colors text-left ${activeTab === 'orders' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
            >
              <Package className="w-5 h-5" />
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-sm transition-colors text-left ${activeTab === 'addresses' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
            >
              <MapPin className="w-5 h-5" />
              Addresses
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-sm transition-colors text-left mt-8"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-200 rounded-sm p-6 md:p-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-serif mb-6 pb-4 border-b border-gray-100">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Member Since</label>
                    <p className="font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white border border-gray-200 rounded-sm p-6 md:p-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-serif">Saved Addresses</h2>
                  {!editingAddressId && (
                    <Button variant="outline" size="sm" onClick={handleAddNewAddress}>
                      Add New Address
                    </Button>
                  )}
                </div>
                
                {editingAddressId ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Street Address</label>
                      <input 
                        type="text" 
                        required
                        value={addressForm.address}
                        onChange={e => setAddressForm({...addressForm, address: e.target.value})}
                        className="w-full border border-gray-200 px-4 py-2 rounded-sm outline-none focus:border-gold-500"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">City</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.city}
                          onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full border border-gray-200 px-4 py-2 rounded-sm outline-none focus:border-gold-500"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Country</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.country}
                          onChange={e => setAddressForm({...addressForm, country: e.target.value})}
                          className="w-full border border-gray-200 px-4 py-2 rounded-sm outline-none focus:border-gold-500"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit">Save Address</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingAddressId(null)}>Cancel</Button>
                    </div>
                  </form>
                ) : savedAddresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map(addr => (
                      <div key={addr.id} className="border border-gray-200 rounded-sm p-4 relative flex flex-col h-full">
                        {addr.isDefault && (
                          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-100 text-xs font-medium rounded-sm text-gray-600">Default</div>
                        )}
                        <p className="font-medium text-gray-900 mb-1">{user.fullName}</p>
                        <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                        <p className="text-gray-600 text-sm mb-1">{addr.city}, {addr.country}</p>
                        <p className="text-gray-600 text-sm mb-4">{user.phone}</p>
                        <div className="mt-auto pt-4 flex gap-3 border-t border-gray-100">
                          <button onClick={() => handleEditAddress(addr)} className="text-sm font-medium text-gold-600 hover:text-gold-700">Edit</button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-medium text-red-600 hover:text-red-700">Delete</button>
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-sm font-medium text-gray-500 hover:text-gray-700 ml-auto">Set as Default</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-6">Add an address for faster checkout.</p>
                    <Button onClick={handleAddNewAddress}>Add Address</Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Tracking Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-6 h-6 text-gold-600" />
                    <h2 className="text-xl font-serif">Tracking Your Order</h2>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">Follow these steps to track your shipment. <span className="font-medium text-gray-900">Notice:</span> The tracking number will be shown to you as soon as we send your order.</p>
                  
                  <ol className="space-y-3 text-sm text-gray-700 list-decimal list-inside ml-2">
                    <li><span className="font-medium">Copy</span> the tracking number of the order you want to track.</li>
                    <li><span className="font-medium">Enter</span> this website: <a href="https://95543.qiyukf.com/client?k=51551590dbef83c8b969e4726877a5d1&wp=1&robotShuntSwitch=1&robotId=75059&t=%e7%94%b3%e9%80%9a%e5%ae%98%e7%bd%91" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline break-all">https://95543.qiyukf.com/client...</a></li>
                    <li><span className="font-medium">Paste</span> your tracking number in the chat.</li>
                    <li>You will see the order details and where it arrived until that moment.</li>
                    <li>We will get notified anyway when your order arrives.</li>
                  </ol>
                </div>

                {/* Orders List */}
                <div className="bg-white border border-gray-200 rounded-sm p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-serif">Order History</h2>
                  </div>
                  
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                      <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userOrders.map((order) => {
                        const timeKey = new Date(order.createdAt).toISOString().substring(0, 16);
                        const supabaseInfo = supabaseData[timeKey];
                        const trackingNumber = supabaseInfo?.tracking || order.trackingNumber || '';
                        const status = supabaseInfo?.status || order.status || 'pending_payment';

                        return (
                          <div key={order.id} className="border border-gray-200 rounded-sm p-5 flex flex-col gap-4 hover:border-gold-500 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono font-medium text-gray-900">{order.orderNumber}</span>
                                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
                                    {STATUS_LABELS[status] || status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s) • {formatCurrency(order.totalPriceCNY)}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate('/checkout/success', { state: { orderId: order.id } })}
                              >
                                View Details <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-sm border border-gray-100">
                              <span className="text-sm font-medium text-gray-700">Tracking Number:</span>
                              {trackingNumber ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm text-gold-600 font-medium">{trackingNumber}</span>
                                  <button 
                                    onClick={() => copyToClipboard(trackingNumber)}
                                    className="p-1.5 text-gray-400 hover:text-black transition-colors rounded-sm hover:bg-gray-200"
                                    title="Copy tracking number"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400 italic">Pending (will be updated soon)</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
