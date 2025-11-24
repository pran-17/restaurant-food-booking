# Restaurant Ordering System

A full-stack restaurant ordering application with QR code-based ordering, real-time order tracking, and admin management dashboard.

## Tech Stack

**Frontend:**
- React with TypeScript
- Vite
- React Router
- Tailwind CSS
- Socket.io Client
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose (API lives in `backend/`)

## Features

### Customer Side
- QR code-based ordering (scan QR → menu opens with table number)
- Browse menu with filters (veg/non-veg, categories)
- Add items to cart with quantity management
- Place orders
- Real-time order status tracking (received → preparing → ready → served)
- View order history by table

### Admin Side
- Simple password-based login
- View all orders grouped by table
- Update order status in real-time
- Manage menu items (add, edit, delete)
- Toggle item availability
- Real-time notifications for new orders

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Cart.tsx
│   │   └── MenuItemCard.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── OrderStatusPage.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminMenu.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── socket.ts
│   │   └── supabase.ts
│   └── types/
│       └── index.ts
├── backend/
│   ├── server.js               # Mongo-backed REST API
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── menuController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Sale.js
│   └── routes/
│       ├── adminRoutes.js
│       ├── menuRoutes.js
│       └── orderRoutes.js
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env` file at the project root for the frontend:

```env
VITE_API_URL=http://localhost:4000/api
```

Create `backend/.env` for the server:

```env
MONGODB_URI=mongodb://localhost:27017/restaurant
PORT=4000
ADMIN_PASSWORD=admin123
```

### 4. Database
- MongoDB database `restaurant` stores menu items, customer orders, and admin sales logs through the backend service.

## Running the Application

### Start Backend API
```bash
npm run backend
```
or simply
```bash
npm run server
```
Runs on `http://localhost:4000` and requires a local MongoDB instance (default connection string `mongodb://localhost:27017/restaurant`).

### Start Frontend (in a separate terminal)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## Usage

### Customer Flow
1. Visit `http://localhost:5173/menu?table=1` (or scan QR code with table number)
2. Browse menu and add items to cart
3. Click "View Cart" and place order
4. Track order status at `/order-status?table=1`

### Admin Flow
1. Visit `http://localhost:5173/admin/login`
2. Login with password (default: `admin123`)
3. View orders by table on dashboard
4. Update order status (received → preparing → ready → served)
5. Manage menu items at `/admin/menu`

## API Endpoints

### Backend (`${VITE_API_URL || http://localhost:4000/api}`)

**Admin**
- `GET /api/admin/menu` – list menu items stored in MongoDB
- `POST /api/admin/menu` – add a menu item (name, price, category, etc.)
- `PATCH /api/admin/menu/:id` – update an item
- `DELETE /api/admin/menu/:id` – remove an item
- `GET /api/admin/orders` – list all customer orders
- `PATCH /api/admin/orders/:id/status` – update order status/payment (optionally record a sale)
- `POST /api/admin/sales` – record a manual sale entry
- `GET /api/admin/sales` – list sales with optional order linkage
- `GET /api/admin/sales/summary` – summary grouped by day
- `GET /api/admin/dashboard/summary` – aggregated counts (menu, orders, revenue)

**Customer**
- `POST /api/orders` – create an order (customer info + menu item ids)
- `GET /api/orders/table/:tableNumber` – get orders for a specific table (for order tracking)
- `GET /api/orders/:id` – fetch a single order

## Database Schema (MongoDB)

### menuitems
- `_id` ObjectId
- `name`, `description`, `price`, `category`
- `imageUrl`
- `isVeg` (boolean)
- `isAvailable` (boolean)
- `createdAt`, `updatedAt`

### orders
- `_id` ObjectId
- `tableNumber` (number)
- `customerName`, optional `notes`
- `items[]` `{ menuItem: ObjectId, nameSnapshot, priceSnapshot, quantity }`
- `status` (`received`, `preparing`, `ready`, `served`, `cancelled`)
- `paymentStatus` (`unpaid`, `paid`)
- `totalAmount`
- `createdAt`, `updatedAt`

### sales
- `_id` ObjectId
- `order` (optional ref)
- `amount`, `paymentMethod`
- `recordedAt`
- `notes`

## Build for Production

```bash
npm run build
```

## Notes

- Admin password is stored in environment variable (for demo purposes)
- In production, implement proper authentication with JWT tokens
- Add payment integration for complete ordering system
- Generate QR codes with table numbers for physical implementation
- Add more robust error handling and validation
