export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export interface OrderItem {
  menuItem: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName?: string;
  status: 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
