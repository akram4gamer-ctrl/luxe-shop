import { Container } from '@/components/ui/Container';
import { BookOpen, Settings, Server, Shield } from 'lucide-react';

export function AdminDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-gold-500" />
          Store Documentation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-gray-200 rounded-sm">
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              How to change Store Settings
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Store details like name, contact info, and hero section can be managed directly from the Admin Panel.
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>Navigate to the <strong>Settings</strong> tab in the Admin Panel.</li>
              <li>Update the desired fields (e.g., Store Name, Hero Title).</li>
              <li>Click <strong>Save Changes</strong>.</li>
              <li>The changes will be immediately reflected on the customer-facing store.</li>
            </ol>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-sm">
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              How to add new categories
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Categories can now be managed directly from the Admin Panel.
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>Navigate to the <strong>Categories</strong> tab in the Admin Panel.</li>
              <li>Click the <strong>Add Category</strong> button.</li>
              <li>Fill in the category name, slug, and description.</li>
              <li>Click <strong>Add Category</strong> to save.</li>
              <li>The new category will automatically appear in the Shop filters and Admin product form.</li>
            </ol>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
          <Server className="w-6 h-6 text-gold-500" />
          Deployment & Production
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded-sm">
            <h3 className="font-medium text-lg mb-3">Deployment Instructions</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              This project is built with Vite and React. It can be deployed to any static hosting service like Vercel, Netlify, or Cloudflare Pages.
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-sm font-mono text-sm overflow-x-auto">
              <p className="text-gray-400 mb-1"># 1. Install dependencies</p>
              <p className="mb-4">npm install</p>
              
              <p className="text-gray-400 mb-1"># 2. Build for production</p>
              <p className="mb-4">npm run build</p>
              
              <p className="text-gray-400 mb-1"># 3. Deploy the 'dist' folder</p>
              <p># (Vercel/Netlify will do this automatically)</p>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-sm">
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-400" />
              Production Readiness Notes
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Before launching this store for real customers, the following technical debt must be addressed:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-3">
              <li>
                <strong className="text-gray-900">Backend Database:</strong> Currently, products and cart data are stored in the browser's LocalStorage. This means if a user clears their cache, they lose their cart, and admin changes only affect the admin's local browser. You MUST connect a real database (e.g., PostgreSQL, MongoDB, Firebase) to persist products globally.
              </li>
              <li>
                <strong className="text-gray-900">Authentication:</strong> The admin login currently uses a hardcoded mock password (<code className="bg-gray-100 px-1 py-0.5 rounded">admin123</code>). Implement real JWT or session-based authentication (e.g., NextAuth, Supabase Auth) before deploying.
              </li>
              <li>
                <strong className="text-gray-900">Image Hosting:</strong> Product images are currently URLs. Implement an image upload service (e.g., AWS S3, Cloudinary) so admins can upload files directly from their computer.
              </li>
              <li>
                <strong className="text-gray-900">Order Management:</strong> The checkout process generates an order, but it is not saved anywhere. Create a backend endpoint to receive order data, save it to a database, and notify the admin (via email or SMS) when a new order is placed.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
