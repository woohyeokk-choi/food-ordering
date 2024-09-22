interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

type PizzaSize = "S" | "M" | "L" | "XL";

type CartItem = {
  id: string;
  product: Product;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: PizzaSize) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  totalPrice: number;
};

export type { Product, PizzaSize, CartItem, CartType };
