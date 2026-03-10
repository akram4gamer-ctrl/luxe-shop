import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { useOrderStore } from '@/store/orderStore';
import { User, Package, MapPin, LogOut, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function AccountDashboard() {
  const { user, isAuthenticated, logout } = useCustomerAuthStore();
  const { getOrdersByUser } = useOrderStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = getOrdersByUser(user.id).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-black font-medium rounded-sm transition-colors text-left">
              <User className="w-5 h-5" />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black font-medium rounded-sm transition-colors text-left">
              <Package className="w-5 h-5" />
              Orders
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black font-medium rounded-sm transition-colors text-left">
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
            {/* Profile Info */}
            <div className="bg-white border border-gray-200 rounded-sm p-6 md:p-8">
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

            {/* Orders Section */}
            <div className="bg-white border border-gray-200 rounded-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-serif">Recent Orders</h2>
                {userOrders.length > 0 && <Button variant="ghost" size="sm">View All</Button>}
              </div>
              
              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                  <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold-500 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-medium text-gray-900">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <span className="font-medium">{formatCurrency(order.totalPriceCNY)}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/checkout/success', { state: { orderId: order.id } })}
                        >
                          View Details <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
