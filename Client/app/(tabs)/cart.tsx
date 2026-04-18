/** @format */

import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// 🧪 Dummy Data
// 🧪 Dummy Data (FIXED + UNIQUE ITEMS)
const DUMMY_CART = [
  {
    _id: "1",
    name: "Nike Air Max 270",
    price: 4999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db"],
  },
  {
    _id: "2",
    name: "Apple Watch Series 9",
    price: 29999,
    quantity: 2,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
  },
  {
    _id: "3",
    name: "Samsung Galaxy Buds 2",
    price: 9999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1585386959984-a41552231693"],
  },
  {
    _id: "4",
    name: "Adidas Running Shoes",
    price: 3599,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
  },
  {
    _id: "5",
    name: "Boat Bluetooth Speaker",
    price: 2499,
    quantity: 3,
    images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab"],
  },
  {
    _id: "6",
    name: "Canon DSLR Camera",
    price: 55999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
  },
  {
    _id: "7",
    name: "Canon DSLR Camera",
    price: 55999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
  },
  {
    _id: "7",
    name: "Canon DSLR Camera",
    price: 55999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
  },
  {
    _id: "7",
    name: "Canon DSLR Camera",
    price: 55999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
  },
  {
    _id: "7",
    name: "Canon DSLR Camera",
    price: 55999,
    quantity: 1,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
  },
];

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(DUMMY_CART);

  // 💰 Total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ➕ Increase
  const increaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // ➖ Decrease
  const decreaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1 ?
          { ...item, quantity: item.quantity - 1 }
        : item,
      ),
    );
  };

  // ❌ Remove
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

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

      {/* 📦 EMPTY STATE */}
      {isEmpty ?
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
          {/* 📦 CART LIST */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 200,
            }}
            renderItem={({ item }) => (
              <View className="flex-row  items-center bg-gray-50 p-3 rounded-xl mb-3">
                {/* IMAGE */}
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />

                {/* INFO */}
                <View className="flex-1 ml-3">
                  <Text className="font-semibold" numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text className="text-gray-600 mt-1">₹{item.price}</Text>

                  {/* QTY */}
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

                {/* DELETE */}
                <TouchableOpacity onPress={() => removeItem(item._id)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* 💰 BOTTOM BAR */}
          {/* 💰 BOTTOM BAR (FIXED) */}
          <View className="absolute pb-20   bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            {/* Subtotal */}
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Subtotal </Text>
              <Text className="font-semibold">₹{cartTotal}</Text>
            </View>

            {/* Shipping */}
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Shipping </Text>
              <Text className="font-semibold text-green-600">FREE</Text>
            </View>

            {/* Total */}
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
