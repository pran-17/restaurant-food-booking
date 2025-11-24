import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { Order } from '../types';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
  averageOrderValue: number;
}

interface SalesAnalyticsProps {
  orders: Order[];
}

export default function SalesAnalytics({ orders }: SalesAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    calculateAnalytics();
  }, [orders]);

  const calculateAnalytics = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const uniqueTables = new Set(todayOrders.map((order) => order.tableNumber));

    setAnalytics({
      totalOrders: todayOrders.length,
      totalRevenue,
      uniqueCustomers: uniqueTables.size,
      averageOrderValue: todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0,
    });
  };

  const cards = [
    {
      title: 'Total Orders Today',
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Revenue Today',
      value: `₹${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Customers Visited',
      value: analytics.uniqueCustomers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Average Order Value',
      value: `₹${analytics.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 shadow-md border-l-4 ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${card.textColor} text-sm font-semibold mb-1`}>
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
