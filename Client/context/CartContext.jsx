/** @format */

import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { createContext, useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/lib/api"; // adjust path

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data?.cart || []);
    } catch (err) {
      console.log("Cart Fetch Error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Add to cart
  const addToCart = async (product) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not authenticated",
      });
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      const res = await api.post("/cart", product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        fetchCart();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product added to cart",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add to cart",
      });
      console.log("Cart Add Error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ❌ Remove item
  const removeFromCart = async (product) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not authenticated",
      });
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      const res = await api.delete(
        `/cart/item/${product._id}?size=${product.size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        fetchCart();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product removed from cart",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove cart",
      });
      console.log("Cart Remove Error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Update quantity
  const updateQuantity = async (product, quantity) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not authenticated",
      });
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      const res = await api.put(
        `/cart/item/${product._id}`,
        { quantity, size: product.size },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        fetchCart();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Cart updated",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update cart",
      });
      console.log("Cart Update Error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧹 Clear cart
  const clearCart = async () => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not authenticated",
      });
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      const res = await api.delete("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCart([]);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Cart cleared",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to clear cart",
      });
      console.log("Cart Clear Error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 💰 Total price
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // 📦 Total items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isLoading,
      }}
    >
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