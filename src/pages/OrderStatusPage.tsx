import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      if (!tableNumber) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const response = await api.orders.getByTable(parseInt(tableNumber || '0', 10));
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [tableNumber]);

  useEffect(() => {
    if (!tableNumber) {
      setLoading(false);
      setOrders([]);
      return;
    }
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [tableNumber, loadOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <Clock className="text-blue-500" size={24} />;
      case 'preparing':
        return <ChefHat className="text-orange-500" size={24} />;
      case 'ready':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'served':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-green-200 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'received':
        return 25;
      case 'preparing':
        return 50;
      case 'ready':
        return 75;
      case 'served':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'served':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          {tableNumber && (
            <p className="text-sm text-gray-600">Table {tableNumber}</p>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {order.status !== 'cancelled' && (
                  <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Order Progress</span>
                      <span className="text-xs font-semibold text-gray-600">{getProgressPercentage(order.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(order.status)}`}
                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-xs">
                      <div className={`text-center ${order.status === 'received' || order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                        <div>📋</div>
                        <div>Received</div>
                      </div>
                      <div className={`text-center ${order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                        <div>👨‍🍳</div>
                        <div>Preparing</div>
                      </div>
                      <div className={`text-center ${order.status === 'ready' || order.status === 'served' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                        <div>✅</div>
                        <div>Ready</div>
                      </div>
                      <div className={`text-center ${order.status === 'served' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                        <div>🍽️</div>
                        <div>Served</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.nameSnapshot} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{item.priceSnapshot * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-green-600">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
