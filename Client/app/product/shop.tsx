/** @format */

import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Shop() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  // ✅ Fetch Products
  const fetchProducts = () => {
    const start = (page - 1) * LIMIT;
    const end = start + LIMIT;

    const newProducts = dummyProducts.slice(start, end);

    if (newProducts.length < LIMIT) {
      setHasMore(false);
    }

    setProducts((prev) => [...prev, ...newProducts]);
  };

  // ✅ Load More
  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header title="Shop" showCart showBack />
      <View className="flex-1 ">
        <View className="flex-1 bg-white">
          {/* 🔍 Search + Filter */}
          <View className="flex-row items-center px-4 mb-3">
            {/* Search */}
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-3 py-2">
              <Ionicons name="search" size={18} color="gray" />
              <TextInput
                placeholder="Search products..."
                className="ml-2 flex-1"
              />
            </View>

            {/* Filter */}
            <TouchableOpacity className="ml-3 bg-gray-100 p-3 rounded-full">
              <Ionicons name="options-outline" size={20} />
            </TouchableOpacity>
          </View>

          {/* 📦 Products */}
          <FlatList
            data={products}
            keyExtractor={(item) => item._id || item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProductCard product={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
