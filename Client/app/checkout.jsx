/** @format */

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "@/constants/api";
import Toast from "react-native-toast-message";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { getToken } = useAuth();
  const { cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const subtotal = cartTotal || 500;
  const shipping = 50;
  const tax = 10;
  const total = subtotal + shipping + tax;

  // ✅ FETCH ADDRESS
  const fetchAddress = async () => {
    try {
      const token = await getToken();

      const res = await api.get("/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const addList = res.data?.addresses || res.data || [];

      if (addList.length > 0) {
        setSelectedAddress(addList[0]);
      }

      console.log(addList);
    } catch (err) {
      console.log("Fetch address error:", err?.message);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // ✅ PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select an address",
      });
      return;
    }

    if (selectedPayment === "stripe") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Stripe payment is not supported yet",
      });
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      const response = await api.post(
        "/orders",
        {
          address: selectedAddress,
          paymentMethod: selectedPayment,
          subtotal,
          shipping,
          tax,
          total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        clearCart();

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Order placed successfully",
        });

        router.push("/");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order",
      });
      console.log("Place order error:", err?.message);
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

        <View className="mt-3 p-4 border border-gray-200 rounded-xl">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="font-bold text-lg">
                {selectedAddress?.type || "Home"}
              </Text>

              <Text className="text-gray-600 text-base font-semibold mt-1">
                {selectedAddress ?
                  `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "No address selected"}
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/addresses")}>
              <Text className="text-blue-500 font-semibold">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= PAYMENT METHOD ================= */}
        <Text className="text-lg font-bold mt-6">Payment Method</Text>

        <TouchableOpacity
          onPress={() => setSelectedPayment("cod")}
          className={`mt-3 p-4 rounded-xl flex-row items-center justify-between border ${
            selectedPayment === "cod" ?
              "border-black bg-gray-50"
            : "border-gray-200"
          }`}>
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

          {selectedPayment === "cod" && (
            <Ionicons name="checkmark-circle" size={22} color="green" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedPayment("card")}
          className={`mt-3 p-4 rounded-xl flex-row items-center justify-between border ${
            selectedPayment === "card" ?
              "border-black bg-gray-50"
            : "border-gray-200"
          }`}>
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

          {selectedPayment === "card" && (
            <Ionicons name="checkmark-circle" size={22} color="green" />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ================= SUMMARY ================= */}
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

      {/* ================= BUTTON ================= */}
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
