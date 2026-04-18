/** @format */

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const subtotal = 500;
  const shipping = 50;
  const tax = 10;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      router.push("/order-success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Checkout" showBack />

      <ScrollView className="flex-1 px-4">
        {/* ================= SHIPPING ADDRESS ================= */}
        <Text className="text-lg font-bold mt-4">Shipping Address</Text>

        {/* ADDRESS CARD */}
        <View className="mt-3 p-4 border border-gray-200 rounded-xl">
          <View className="flex-row justify-between items-start">
            {/* LEFT SIDE */}
            <View className="flex-1">
              <Text className="font-bold text-lg">Home</Text>

              <Text className="text-gray-600 text-base font-semibold mt-1">
                123 Main Street, Near Market, Kanpur, UP
              </Text>
            </View>

            {/* RIGHT SIDE EDIT */}
              <TouchableOpacity onPress={() => router.push("/addresses")}>
              <Text className="text-blue-500 font-semibold">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= PAYMENT METHOD ================= */}
        <Text className="text-lg font-bold mt-6">Payment Method</Text>


        {/* CASH ON DELIVERY */}
        <TouchableOpacity
          onPress={() => setSelectedPayment("cod")}
          className={`mt-3 p-4 rounded-xl flex-row items-center justify-between border ${
            selectedPayment === "cod" ?
              "border-black bg-gray-50"
            : "border-gray-200"
          }`}>
          {/* LEFT SIDE */}
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="cash-outline"
              size={22}
              color={selectedPayment === "cod" ? "black" : "gray"}
            />

            <View className="ml-3">
              <Text className="font-bold text-lg">Cash on Delivery</Text>
              <Text className="text-gray-500 text-sm">
                Pay when you receive order
              </Text>
            </View>
          </View>

          {/* RIGHT SIDE CHECK */}
          {selectedPayment === "cod" && (
            <Ionicons name="checkmark-circle" size={22} color="green" />
          )}
        </TouchableOpacity>

        {/* CARD PAYMENT */}
        <TouchableOpacity
          onPress={() => setSelectedPayment("card")}
          className={`mt-3 p-4 rounded-xl flex-row items-center justify-between border ${
            selectedPayment === "card" ?
              "border-black bg-gray-50"
            : "border-gray-200"
          }`}>
          {/* LEFT SIDE */}
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="card-outline"
              size={22}
              color={selectedPayment === "card" ? "black" : "gray"}
            />

            <View className="ml-3">
              <Text className="font-bold text-lg">Card Payment</Text>
              <Text className="text-gray-500 text-sm">
                Pay with Credit / Debit Card
              </Text>
            </View>
          </View>

          {/* RIGHT SIDE CHECK */}
          {selectedPayment === "card" && (
            <Ionicons name="checkmark-circle" size={22} color="green" />
          )}
        </TouchableOpacity>
      </ScrollView>
      {/* ================= SUMMARY CARD ================= */}
      <View className="mt-8 p-4 bg-gray-50 rounded-xl">
        <Text className="text-lg font-bold mb-3">Order Summary</Text>

        <View className="flex-row justify-between mb-2">
          <Text>Subtotal</Text>
          <Text>₹{subtotal}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text>Shipping</Text>
          <Text>₹{shipping}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text>Tax</Text>
          <Text>₹{tax}</Text>
        </View>

        <View className="border-t pt-3 flex-row justify-between">
          <Text className="font-bold">Total</Text>
          <Text className="font-bold">₹{total}</Text>
        </View>
      </View>

      {/* ================= PLACE ORDER BUTTON ================= */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          className="bg-black py-3 rounded-xl">
          {loading ?
            <ActivityIndicator color="white" />
          : <Text className="text-white text-center font-semibold">
              Place Order
            </Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
