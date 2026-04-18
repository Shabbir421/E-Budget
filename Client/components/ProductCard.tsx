/** @format */

import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ProductCardProps } from "@/assets/constants/types";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFav = isInWishlist(product._id);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity
        className="w-[48%] bg-white rounded-xl p-1 mb-4"
        activeOpacity={0.8}>
        {/* Image */}
        <View className="relative">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-48 rounded"
            resizeMode="cover"
          />

          {/* ❤️ Favorite */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 bg-white p-1 rounded-full">
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={18}
              color={isFav ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={14} color="#facc15" />
          <Text className="text-xs text-gray-600 ml-1">
            {(product.rating ?? 4.5).toFixed(2)}
          </Text>
        </View>

        {/* Name */}
        <Text className="text-sm font-semibold mt-2" numberOfLines={1}>
          {product.name}
        </Text>

        {/* Price */}
        <Text className="text-primary font-bold mt-1">₹{product.price}</Text>
      </TouchableOpacity>
    </Link>
  );
}
