import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './storage';

export type OrderStatus = 
  | 'pending_payment'
  | 'paid_processing'
  | 'in_shipping'
  | 'arrived_waiting_pickup'
  | 'completed';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  totalPriceCNY: number;
  customerName: string;
  email?: string;
  phone: string;
  country?: string;
  city?: string;
  address: string;
  notes?: string;
  adminNotes?: string;
  status: OrderStatus;
  trackingNumber?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  paidAt?: string | null;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  updateOrderTracking: (id: string, trackingNumber: string) => void;
  updateAdminNotes: (id: string, adminNotes: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (id, status, note) => set((state) => ({
        orders: state.orders.map(order => {
          if (order.id === id) {
            return {
              ...order,
              status,
              statusHistory: [
                ...order.statusHistory,
                { status, timestamp: new Date().toISOString(), note }
              ]
            };
          }
          return order;
        })
      })),
      updateOrderTracking: (id, trackingNumber) => set((state) => ({
        orders: state.orders.map(order => order.id === id ? { ...order, trackingNumber } : order)
      })),
      updateAdminNotes: (id, adminNotes) => set((state) => ({
        orders: state.orders.map(order => order.id === id ? { ...order, adminNotes } : order)
      })),
      getOrderById: (id) => get().orders.find(o => o.id === id),
      getOrderByNumber: (orderNumber) => get().orders.find(o => o.orderNumber === orderNumber),
      getOrdersByUser: (userId) => get().orders.filter(o => o.userId === userId),
    }),
    {
      name: 'aura-orders',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
  return `ORD-${year}-${randomPart}`;
};
