import { X, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  tableNumber: string;
  tableError?: string;
  onTableNumberChange: (value: string) => void;
  onClose: () => void;
  onPlaceOrder: () => void;
}

export default function Cart({
  items,
  tableNumber,
  tableError,
  onTableNumberChange,
  onClose,
  onPlaceOrder,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isTableValid = tableNumber.trim().length > 0;

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-center py-8">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number *
            </label>
            <input
              type="number"
              min={1}
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                tableError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
              }`}
              placeholder="Enter your table number"
            />
            {tableError && <p className="text-sm text-red-600 mt-1">{tableError}</p>}
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-3 border-b">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.price} × {item.qty}
                </p>
              </div>
              <span className="font-semibold">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={!isTableValid}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
