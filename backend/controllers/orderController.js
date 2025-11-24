import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Sale from '../models/Sale.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    customerName,
    customerEmail,
    customerPhone,
    tableNumber,
    notes,
    metadata,
  } = req.body;

  const normalizedTableNumber = Number(tableNumber);

  if (!normalizedTableNumber || Number.isNaN(normalizedTableNumber)) {
    return res.status(400).json({ message: 'Valid table number is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'At least one menu item is required' });
  }

  const menuIds = items.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuIds }, isAvailable: true });

  if (menuItems.length !== items.length) {
    return res.status(400).json({ message: 'One or more menu items are unavailable' });
  }

  const orderItems = items.map((orderItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === orderItem.menuItemId
    );
    return {
      menuItem: menuItem._id,
      nameSnapshot: menuItem.name,
      priceSnapshot: menuItem.price,
      quantity: Math.max(1, orderItem.quantity ?? 1),
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );

  const order = await Order.create({
    customerName: customerName?.trim() || `Table ${normalizedTableNumber}`,
    customerEmail,
    customerPhone,
    tableNumber: normalizedTableNumber,
    notes,
    items: orderItems,
    totalAmount,
    metadata,
  });

  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrdersByTable = asyncHandler(async (req, res) => {
  const tableNumber = Number(req.params.tableNumber);

  if (Number.isNaN(tableNumber)) {
    return res.status(400).json({ message: 'Invalid table number' });
  }

  const orders = await Order.find({ tableNumber }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus, recordSale } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (status) {
    order.status = status;
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  if (recordSale && paymentStatus === 'paid') {
    await Sale.create({
      order: order._id,
      amount: order.totalAmount,
      paymentMethod: recordSale.paymentMethod,
      notes: recordSale.notes,
    });
  }

  res.json(order);
});

