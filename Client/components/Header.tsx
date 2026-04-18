/** @format */

import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { HeaderProps } from "@/assets/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();

  const { itemCount } = { itemCount: 3 };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white relative">
      {/* LEFT SIDE */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity
            onPress={() => console.log("Open menu")}
            className="mr-4">
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* CENTER (ALWAYS FIXED CENTER) */}
      <View className="absolute left-0 right-0 items-center justify-center">
        {showLogo ?
          <Image
            source={require("@/assets/logo.png")}
            style={{ width: 100, height: 24, resizeMode: "contain" }}
          />
        : <Text className="text-lg font-bold text-center" numberOfLines={1}>
            {title}
          </Text>
        }
      </View>

      {/* RIGHT SIDE */}
      <View className="flex-row items-center">
        {showSearch && (
          <TouchableOpacity className="mr-4">
            <Ionicons name="search-outline" size={22} color="black" />
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View className="relative mr-4">
              <Ionicons name="bag-outline" size={22} color="black" />

              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {itemCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
