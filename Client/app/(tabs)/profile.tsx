/** @format */

import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/clerk-expo";

export default function Profile() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const menuItems = [
    { title: "My Orders", icon: "bag-outline", route: "/orders" },
    {
      title: "Shipping Address",
      icon: "location-outline",
      route: "/addresses",
    },
    {
      title: "My Reviews",
      icon: "star-outline",
      route: "/review-setting/myReview",
    },
    {
      title: "Settings",
      icon: "settings-outline",
      route: "/review-setting/setting",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-bold">Profile</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* 🔥 CONDITIONAL RENDER */}
      {
        !user ?
          // =========================
          // ❌ GUEST USER SCREEN
          // =========================
          <View className="flex-1 items-center justify-center px-6">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              className="w-28 h-28 rounded-full mb-4"
            />

            <Text className="text-xl font-bold mb-2">Guest User</Text>

            <Text className="text-gray-500 text-center mb-6">
              Please login or create an account to continue
            </Text>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              className="w-full bg-blue-600 py-4 rounded-2xl items-center mb-4 shadow-md">
              <Text className="text-white font-bold text-lg">Login</Text>
            </TouchableOpacity>

            {/* SIGNUP BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              className="w-full bg-gray-200 py-4 rounded-2xl items-center">
              <Text className="text-black font-semibold text-lg">Sign Up</Text>
            </TouchableOpacity>
          </View>
          // =========================
          // ✅ LOGGED-IN USER SCREEN
          // =========================
        : <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}>
            {/* USER INFO */}
            <View className="items-center mt-6">
              <Image
                source={{ uri: user.imageUrl }}
                className="w-24 h-24 rounded-full"
              />

              <Text className="text-xl font-bold mt-3">{user.fullName}</Text>

              <Text className="text-gray-500 text-center">
                {user.primaryEmailAddress?.emailAddress}
              </Text>

              <View className="mt-3 px-4 py-1 rounded-full bg-green-100">
                <Text className="text-sm font-semibold text-green-600">
                  User Panel
                </Text>
              </View>
            </View>

            {/* MENU */}
            <View className="mt-8">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(item.route as any)}
                  className="flex-row items-center justify-between py-4 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name={item.icon as any} size={22} />
                    <Text className="ml-4 text-base">{item.title}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="gray" />
                </TouchableOpacity>
              ))}
            </View>

            {/* LOGOUT */}
            <TouchableOpacity
              onPress={async () => {
                await signOut();
                router.replace("/(auth)/sign-in");
              }}
              className="mt-10 bg-red-500 py-3 rounded-full shadow-md">
              <Text className="text-white text-center font-bold text-lg">
                Logout
              </Text>
            </TouchableOpacity>
          </ScrollView>

      }
    </SafeAreaView>
  );
}
