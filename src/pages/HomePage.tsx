import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, User } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <UtensilsCrossed size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Restaurant Ordering System
          </h1>
          <p className="text-xl text-gray-600">
            click on the view menu to order or login as admin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <UtensilsCrossed size={48} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Customer Menu</h2>
            <p className="text-gray-600 mb-6">
              Browse menu and place orders by table number
            </p>
            <button
              onClick={() => navigate('/menu?table=1')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Menu 
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <User size={48} className="mx-auto text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <p className="text-gray-600 mb-6">
              Manage menu items and track orders
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold"></span>
              <span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Real-time order status updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Admin dashboard for order management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Menu management with availability toggle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Order tracking by table number</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
