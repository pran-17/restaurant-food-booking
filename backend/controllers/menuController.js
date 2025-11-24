import MenuItem from '../models/MenuItem.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublicMenu = asyncHandler(async (_req, res) => {
  const items = await MenuItem.find({ isAvailable: true }).sort({ name: 1 });
  res.json(items);
});

