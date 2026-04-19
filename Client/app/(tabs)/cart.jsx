/** @format */

import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/constants/api";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCartItems(res.data?.cart || res.data || []);
    } catch (err) {
      console.log("Cart Fetch Error:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 💰 TOTAL
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ➕ INCREASE
  const increaseQty = async (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

    try {
      await api.patch("/cart/update", {
        productId: id,
        action: "increase",
      });
    } catch (err) {
      console.log(err?.message);
    }
  };

  // ➖ DECREASE
  const decreaseQty = async (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1 ?
          { ...item, quantity: item.quantity - 1 }
        : item,
      ),
    );

    try {
      await api.patch("/cart/update", {
        productId: id,
        action: "decrease",
      });
    } catch (err) {
      console.log(err?.message);
    }
  };

  // ❌ REMOVE
  const removeItem = async (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));

    try {
      await api.delete(`/cart/${id}`);
    } catch (err) {
      console.log(err?.message);
    }
  };
  Toast.show({
    type: "success",
    text1: "Success",
    text2: "Product deleted successfully",
  });

  const isEmpty = cartItems.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 🔝 HEADER */}
      <View className="flex-row   items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-bold">My Cart</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* LOADING */}
      {loading ?
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      : isEmpty ?
        /* 📦 EMPTY STATE */
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="cart-outline" size={90} color="#ccc" />

          <Text className="text-xl font-bold mt-4 text-gray-700">
            Your Cart is Empty
          </Text>

          <Text className="text-gray-500 text-center mt-2">
            Looks like you haven’t added anything yet. Start shopping now!
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-black px-6 py-3 rounded-full">
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      : <>
          {/* CART LIST */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 200,
            }}
            renderItem={({ item }) => (
              <View className="flex-row  items-center bg-gray-50 p-3 rounded-xl mb-3">
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />

                <View className="flex-1 ml-3">
                  <Text className="font-semibold" numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text className="text-gray-600 mt-1">₹{item.price}</Text>

                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      onPress={() => decreaseQty(item._id)}
                      className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
                      <Text>-</Text>
                    </TouchableOpacity>

                    <Text className="mx-3 font-bold">{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => increaseQty(item._id)}
                      className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => removeItem(item._id)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* 💰 BOTTOM BAR */}
          <View className="absolute pb-20 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Subtotal </Text>
              <Text className="font-semibold">₹{cartTotal}</Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Shipping </Text>
              <Text className="font-semibold text-green-600">FREE</Text>
            </View>

            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">₹{cartTotal}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/checkout")}
              disabled={cartItems.length === 0}
              className={`py-3 rounded-full ${
                cartItems.length === 0 ? "bg-gray-400" : "bg-black"
              }`}>
              <Text className="text-center text-white font-semibold">
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      }
    </SafeAreaView>
  );
}
