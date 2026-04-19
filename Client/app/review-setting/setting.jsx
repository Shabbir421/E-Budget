/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function Setting() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchUser = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile(data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logged out"),
      },
    ]);
  };

  const menuItems = [
    { title: "Edit Profile", icon: "person-outline", route: "/edit-profile" },
    { title: "My Orders", icon: "bag-outline", route: "/orders" },
    {
      title: "Shipping Address",
      icon: "location-outline",
      route: "/addresses",
    },
    { title: "Payment Methods", icon: "card-outline", route: "/payments" },
  ];

  const supportItems = [
    { title: "Help Center", icon: "help-circle-outline" },
    { title: "Contact Us", icon: "call-outline" },
    { title: "Privacy Policy", icon: "lock-closed-outline" },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Setting" showBack />

      <ScrollView className="flex-1 px-4">

        {/* PROFILE */}
        <View className="items-center mt-6 mb-6">
          <Image
            source={{
              uri:
                profile?.image ||
                user?.imageUrl ||
                "https://i.pravatar.cc/150",
            }}
            className="w-24 h-24 rounded-full"
          />

          <Text className="text-xl font-bold mt-3">
            {profile?.name || user?.fullName || "User"}
          </Text>

          <Text className="text-gray-500">
            {profile?.email || user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* ACCOUNT */}
        <Text className="text-gray-500 font-semibold mb-2">ACCOUNT</Text>

        <View className="bg-gray-50 rounded-xl p-2 mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 last:border-0">

              <View className="flex-row items-center">
                <Ionicons name={item.icon} size={22} color="black" />
                <Text className="ml-4 text-base">{item.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        {/* SUPPORT */}
        <Text className="text-gray-500 font-semibold mb-2">SUPPORT</Text>

        <View className="bg-gray-50 rounded-xl p-2 mb-6">
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 last:border-0">

              <View className="flex-row items-center">
                <Ionicons name={item.icon} size={22} color="black" />
                <Text className="ml-4 text-base">{item.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-3 rounded-full mb-10">
          <Text className="text-white text-center font-bold">
            Logout
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}