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
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import {api} from "@/constants/api";

export default function Shop() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const LIMIT = 10;

  // ✅ Fetch from backend
  const fetchProducts = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `/products?page=${page}&limit=${LIMIT}`,
      );

      const newProducts = data?.products || data || [];

      setProducts((prev) => [...prev, ...newProducts]);

      if (newProducts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load More
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header title="Shop" showCart showBack />

      <View className="flex-1 bg-white">

        {/* SEARCH */}
        <View className="flex-row items-center px-4 mb-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-3 py-2">
            <Ionicons name="search" size={18} color="gray" />
            <TextInput
              placeholder="Search products..."
              className="ml-2 flex-1"
            />
          </View>

          <TouchableOpacity className="ml-3 bg-gray-100 p-3 rounded-full">
            <Ionicons name="options-outline" size={20} />
          </TouchableOpacity>
        </View>

        {/* PRODUCTS */}
        <FlatList
          data={products}
          keyExtractor={(item) => item._id || item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard  product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
}