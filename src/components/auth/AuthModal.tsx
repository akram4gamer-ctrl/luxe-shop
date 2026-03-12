import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

// Reusing the mockHash from Login
const mockHash = (str: string) => btoa(str);

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, signup, checkEmailExists } = useCustomerAuthStore();
  const [isLogin, setIsLogin] = useState(false); // Default to signup
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isLogin) {
        login(email, mockHash(password));
        toast.success('Successfully logged in!');
        setAuthModalOpen(false);
      } else {
        if (checkEmailExists(email)) {
          throw new Error('An account with this email already exists');
        }
        
        const newCustomer = {
          id: crypto.randomUUID(),
          fullName,
          email,
          phone,
          passwordHash: mockHash(password),
          createdAt: new Date().toISOString(),
        };
        
        signup(newCustomer);
        toast.success('Account created successfully!');
        setAuthModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setAuthModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-3xl border border-white/40"
          >
            <div className="p-8">
              <button 
                onClick={() => setAuthModalOpen(false)} 
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif mb-2 text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isLogin 
                    ? 'Sign in to access your orders and fast checkout.' 
                    : 'Join us to start shopping and track your orders.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                          placeholder="Phone Number"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Email Address"
                  />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-sm font-medium uppercase tracking-widest h-14 mt-4 rounded-xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="text-gold-600 hover:text-gold-700 font-semibold transition-colors"
                >
                  {isLogin ? 'Create an account' : 'Sign in'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
