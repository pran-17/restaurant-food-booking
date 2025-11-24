import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';

interface BillData {
  order: Order;
  billDate: string;
}

export default function AdminBills() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);
  const [searchTable, setSearchTable] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const response = await api.orders.getAll();
      const servedOrders = response.data.filter((order: Order) => order.status === 'served');
      setOrders(servedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBill = (order: Order) => {
    const billDate = new Date(order.updatedAt).toLocaleString();
    setSelectedBill({ order, billDate });
  };

  const printBill = () => {
    if (!selectedBill) return;
    window.print();
  };

  const downloadBill = () => {
    if (!selectedBill) return;
    const { order, billDate } = selectedBill;
    const billContent = `
RESTAURANT BILL
=====================================
Date: ${billDate}
Table: ${order.tableNumber}
Order ID: ${order.id.slice(0, 8)}
=====================================

ITEMS:
${order.items
  .map(
    (item) =>
      `${item.nameSnapshot}
  Qty: ${item.quantity} x ₹${item.priceSnapshot} = ₹${item.priceSnapshot * item.quantity}`
  )
  .join('\n\n')}

=====================================
TOTAL: ₹${order.totalAmount}
=====================================

Thank you for your order!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(billContent));
    element.setAttribute('download', `bill_${order.id.slice(0, 8)}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredOrders = searchTable
    ? orders.filter((order) => order.tableNumber.toString().includes(searchTable))
    : orders;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading bills...</div>
      </div>
    );
  }

  if (selectedBill) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedBill(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={printBill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={downloadBill}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg" id="bill-content">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">RESTAURANT</h1>
              <p className="text-gray-600">Bill</p>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Date:</span>
                <span className="font-semibold">
                  {new Date(selectedBill.order.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Table:</span>
                <span className="font-semibold">{selectedBill.order.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Order ID:</span>
                <span className="font-semibold">{selectedBill.order.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-3">
                    {selectedBill.order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                          <p className="font-semibold text-gray-900">{item.nameSnapshot}</p>
                      <p className="text-sm text-gray-600">
                            {item.quantity} × ₹{item.priceSnapshot}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                          ₹{item.priceSnapshot * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span className="text-green-600">₹{selectedBill.order.totalAmount}</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Thank you for your visit!</p>
              <p>Please come again</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Generate Bills</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by table number..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No served orders to bill</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">{order.items.length}</span> item(s)
                  </p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        {item.nameSnapshot} ×{item.quantity}
                      </p>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{order.items.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3 mb-4">
                  <p className="text-lg font-bold text-green-600">₹{order.totalAmount}</p>
                </div>

                <button
                  onClick={() => generateBill(order)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Eye size={16} />
                  View Bill
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
