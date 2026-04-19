/** @format */

import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorites() {
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const isEmpty = !wishlist || wishlist.length === 0;

  

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-bold">Favorites</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* EMPTY STATE */}
      {isEmpty ?
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="heart-outline" size={80} color="#ccc" />

          <Text className="text-xl font-bold mt-4 text-gray-700">
            No Favorites Yet
          </Text>

          <Text className="text-gray-500 text-center mt-2">
            Start adding products to your wishlist ❤️
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-black px-6 py-3 rounded-full">
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      : <FlatList
          data={wishlist}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/product/${item._id}`)}
              className="flex-row items-center bg-gray-50 p-3 rounded-xl mb-3">
              {/* IMAGE */}
              <Image
                source={{ uri: item.images?.[0] || "" }}
                className="w-20 h-20 rounded-lg"
              />

              {/* INFO */}
              <View className="flex-1 ml-3">
                <Text className="font-semibold" numberOfLines={1}>
                  {item.name}
                </Text>

                <Text className="text-gray-600 mt-1">₹{item.price}</Text>
              </View>

              {/* REMOVE */}
              <TouchableOpacity onPress={() => toggleWishlist(item)}>
                <Ionicons name="heart" size={22} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      }
    </SafeAreaView>
  );
}
