import { Database } from "./database.types";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string | null;
// }

type Product = Tables<"products">;

type PizzaSize = "S" | "M" | "L" | "XL";

type CartItem = {
  id: string;
  product?: Product | null;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};

type CartType = {
  items: CartItem[];
  addItem: (product: Tables<"products">, size: PizzaSize) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  totalPrice: number;
  checkout: () => void;
};

const OrderStatusList: OrderStatus[] = [
  "New",
  "Cooking",
  "Delivering",
  "Delivered",
];

type OrderStatus = "New" | "Cooking" | "Delivering" | "Delivered";

type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Tables<"products">;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type { Product, PizzaSize, CartItem, CartType, Order, OrderStatus };

export { OrderStatusList };
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
