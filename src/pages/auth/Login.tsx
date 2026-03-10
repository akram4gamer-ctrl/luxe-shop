import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { toast } from 'sonner';

// Simple mock hash function (DO NOT USE IN PRODUCTION)
export const mockHash = (str: string) => btoa(str);

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useCustomerAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      login(email, mockHash(password));
      toast.success('Successfully logged in');
      navigate('/account');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-24 max-w-md">
        <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
          <h1 className="text-3xl font-serif text-center mb-8">Welcome Back</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg uppercase tracking-widest h-14"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold-600 hover:text-gold-700 font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
