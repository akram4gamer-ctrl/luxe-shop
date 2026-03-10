import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCustomerAuthStore, Customer } from '@/store/customerAuthStore';
import { toast } from 'sonner';
import { mockHash } from './Login';

export function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const signup = useCustomerAuthStore((state) => state.signup);
  const checkEmailExists = useCustomerAuthStore((state) => state.checkEmailExists);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (checkEmailExists(formData.email)) {
      toast.error('An account with this email already exists');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        passwordHash: mockHash(formData.password),
        createdAt: new Date().toISOString(),
      };
      
      signup(newCustomer);
      toast.success('Account created successfully');
      navigate('/account');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-16 max-w-lg">
        <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
          <h1 className="text-3xl font-serif text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-8">Join Aura Luxury to manage your orders</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="+86 123 4567 8900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg uppercase tracking-widest h-14 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-600 hover:text-gold-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
