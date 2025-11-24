import axios from 'axios';

const baseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000/api';

export const api = {
  menu: {
    getAll: () => axios.get(`${baseUrl}/menu`),
    create: (data: unknown) => axios.post(`${baseUrl}/admin/menu`, data),
    update: (id: string, data: unknown) => axios.patch(`${baseUrl}/admin/menu/${id}`, data),
    delete: (id: string) => axios.delete(`${baseUrl}/admin/menu/${id}`),
  },
  orders: {
    create: (data: unknown) => axios.post(`${baseUrl}/orders`, data),
    getAll: () => axios.get(`${baseUrl}/admin/orders`),
    getByTable: (table: number) => axios.get(`${baseUrl}/orders/table/${table}`),
    updateStatus: (id: string, data: unknown) =>
      axios.patch(`${baseUrl}/admin/orders/${id}/status`, data),
  },
  admin: {
    login: (password: string) => axios.post(`${baseUrl}/admin/login`, { password }),
  },
};
