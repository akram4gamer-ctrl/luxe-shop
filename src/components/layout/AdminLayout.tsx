import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function AdminLayout() {
  const { isAuthenticated, isLoading, checkSession, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setIsLoggingIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
          <h1 className="text-2xl font-serif text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors"
                placeholder="Enter admin password"
                required
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <Container>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-serif font-bold">Aura Admin</h1>
              <nav className="hidden md:flex gap-6">
                <Link 
                  to="/" 
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  View Website
                </Link>
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'text-gold-600' : 'text-gray-500 hover:text-black'}`}
                >
                  Products
                </Link>
                <Link 
                  to="/admin/categories" 
                  className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/admin/categories') ? 'text-gold-600' : 'text-gray-500 hover:text-black'}`}
                >
                  Categories
                </Link>
                <Link 
                  to="/admin/orders" 
                  className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/admin/orders') ? 'text-gold-600' : 'text-gray-500 hover:text-black'}`}
                >
                  Orders
                </Link>
                <Link 
                  to="/admin/settings" 
                  className={`text-sm font-medium transition-colors ${location.pathname === '/admin/settings' ? 'text-gold-600' : 'text-gray-500 hover:text-black'}`}
                >
                  Settings
                </Link>
                <Link 
                  to="/admin/docs" 
                  className={`text-sm font-medium transition-colors ${location.pathname === '/admin/docs' ? 'text-gold-600' : 'text-gray-500 hover:text-black'}`}
                >
                  Docs
                </Link>
              </nav>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </div>
          </div>
        </Container>
      </header>
      <main className="flex-grow py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
