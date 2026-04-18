/** @format */

import React, { createContext, useContext, useState } from "react";

// Product type (adjust if needed)
type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
};

// Cart item with quantity
type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Add to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);

      if (exists) {
        // increase quantity if already exists
        return prev.map((item) =>
          item._id === product._id ?
            { ...item, quantity: item.quantity + 1 }
          : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ❌ Remove completely
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // ➕ Increase quantity
  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // ➖ Decrease quantity
  const decreaseQty = (id: string) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0), // remove if 0
    );
  };

  // 💰 Total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 📦 Total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        getTotalPrice,
        getTotalItems,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
