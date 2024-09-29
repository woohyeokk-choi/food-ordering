import { createContext, PropsWithChildren, useContext } from "react";
import { CartItem, CartType, Tables } from "../../types";
import { useState } from "react";
import { randomUUID } from "expo-crypto";

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  totalPrice: 0,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Tables<"products">, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };
    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + amount,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };

  const totalPrice = items.reduce(
    (acc, item) => (acc += item.product.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
