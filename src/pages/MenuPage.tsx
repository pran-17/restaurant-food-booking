import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ListChecks } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import Cart from '../components/Cart';
import { MenuItem, CartItem } from '../types';
import { api } from '../lib/api';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get('table');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tableInput, setTableInput] = useState<string>(tableNumber || '');
  const [tableError, setTableError] = useState('');
  const [showOrdersPrompt, setShowOrdersPrompt] = useState(false);
  const [ordersTableInput, setOrdersTableInput] = useState<string>(tableNumber || '');
  const [ordersTableError, setOrdersTableError] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    setTableInput(tableNumber || '');
    setOrdersTableInput(tableNumber || '');
  }, [tableNumber]);

  const parseTableNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  };

  const loadMenuItems = async () => {
    try {
      const response = await api.menu.getAll();
      const normalizedItems = response.data.map((item: MenuItem) => ({
        ...item,
        imageUrl: item.imageUrl || item.image || '',
      }));
      setMenuItems(normalizedItems);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(menuItems.map((item) => item.category))];
  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const getItemQuantity = (itemId: string) => {
    return cart.find((item) => item.id === itemId)?.qty || 0;
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item && item.qty > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    }
  };

  const handleTableNumberChange = (value: string) => {
    if (tableError) {
      setTableError('');
    }
    setTableInput(value);
  };

  const handleOrdersClick = () => {
    setOrdersTableInput(tableInput);
    setOrdersTableError('');
    setShowOrdersPrompt(true);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const normalizedTable = parseTableNumber(tableInput);

    if (!normalizedTable) {
      setTableError('Please enter a valid table number');
      return;
    }

    const orderData = {
      tableNumber: normalizedTable,
      customerName: `Table ${normalizedTable}`,
      items: cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.qty,
      })),
    };

    try {
      await api.orders.create(orderData);
      setCart([]);
      setShowCart(false);
      navigate(`/order-status?table=${normalizedTable}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
            {tableInput && <p className="text-sm text-gray-600">Table {tableInput}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOrdersClick}
              className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              <ListChecks size={20} />
              Your Orders
            </button>
            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                <span className="font-semibold">View Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items available in this category</p>
          </div>
        )}
      </div>

      {showCart && (
        <Cart
          items={cart}
          tableNumber={tableInput}
          tableError={tableError}
          onTableNumberChange={handleTableNumberChange}
          onClose={() => {
            setShowCart(false);
            setTableError('');
          }}
          onPlaceOrder={placeOrder}
        />
      )}

      {showOrdersPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-2">View Your Orders</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your table number to see all orders and live status updates.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number *
            </label>
            <input
              type="number"
              min={1}
              value={ordersTableInput}
              onChange={(e) => {
                if (ordersTableError) setOrdersTableError('');
                setOrdersTableInput(e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                ordersTableError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'
              }`}
              placeholder="Enter your table number"
            />
            {ordersTableError && (
              <p className="text-sm text-red-600 mt-1">{ordersTableError}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowOrdersPrompt(false);
                  setOrdersTableError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const parsed = parseTableNumber(ordersTableInput);
                  if (!parsed) {
                    setOrdersTableError('Please enter a valid table number');
                    return;
                  }
                  setTableInput(String(parsed));
                  setTableError('');
                  setShowOrdersPrompt(false);
                  navigate(`/order-status?table=${parsed}`);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
