import MenuItem from '../models/MenuItem.js';
import Sale from '../models/Sale.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const normalizeMenuPayload = (body) => {
  const payload = {};

  if (typeof body.name === 'string') {
    payload.name = body.name.trim();
  }
  if (typeof body.description === 'string') {
    payload.description = body.description.trim();
  }
  if (typeof body.price !== 'undefined') {
    payload.price = Number(body.price);
  }
  if (typeof body.category === 'string') {
    payload.category = body.category.trim();
  }
  if (typeof body.imageUrl === 'string') {
    payload.imageUrl = body.imageUrl.trim();
  } else if (typeof body.image === 'string') {
    payload.imageUrl = body.image.trim();
  }
  if (typeof body.isVeg === 'boolean') {
    payload.isVeg = body.isVeg;
  } else if (typeof body.is_veg === 'boolean') {
    payload.isVeg = body.is_veg;
  }
  if (typeof body.isAvailable === 'boolean') {
    payload.isAvailable = body.isAvailable;
  } else if (typeof body.available === 'boolean') {
    payload.isAvailable = body.available;
  }

  return payload;
};

export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  res.json({ success: true, token: 'mock-admin-token' });
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const payload = normalizeMenuPayload(req.body);
  if (
    !payload.name ||
    !payload.category ||
    typeof payload.price !== 'number' ||
    Number.isNaN(payload.price)
  ) {
    return res.status(400).json({ message: 'Name, category, and price are required' });
  }
  const item = await MenuItem.create(payload);
  res.status(201).json(item);
});

export const getMenuItems = asyncHandler(async (_req, res) => {
  const items = await MenuItem.find().sort({ createdAt: -1 });
  res.json(items);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const payload = normalizeMenuPayload(req.body);
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return res.status(404).json({ message: 'Menu item not found' });
  }

  res.json(updated);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const deleted = await MenuItem.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  res.json({ message: 'Menu item removed' });
});

export const recordSale = asyncHandler(async (req, res) => {
  const sale = await Sale.create(req.body);
  res.status(201).json(sale);
});

export const getSales = asyncHandler(async (_req, res) => {
  const sales = await Sale.find()
    .populate('order', 'customerName tableNumber totalAmount status')
    .sort({ recordedAt: -1 });
  res.json(sales);
});

export const getSalesSummary = asyncHandler(async (_req, res) => {
  const summary = await Sale.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$recordedAt' },
          month: { $month: '$recordedAt' },
          day: { $dayOfMonth: '$recordedAt' },
        },
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
  ]);

  res.json(summary);
});

export const getDashboardMetrics = asyncHandler(async (_req, res) => {
  const [menuCount, orderCount, revenue, activeOrders] = await Promise.all([
    MenuItem.countDocuments(),
    Order.countDocuments(),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Order.countDocuments({ status: { $in: ['received', 'preparing'] } }),
  ]);

  res.json({
    menuCount,
    orderCount,
    activeOrders,
    revenue: revenue[0]?.total || 0,
  });
});

