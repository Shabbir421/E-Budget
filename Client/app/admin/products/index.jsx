/** @format */

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "@/constants/api";
import Toast from "react-native-toast-message";

export default function AdminProducts() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);

  // ✅ GET PRODUCTS
  const fetchProducts = async () => {
    try {
      const token = await getToken();

      const res = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.products || res.data || [];

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch products error:", err?.message);

      setProducts([]);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // ✅ DELETE (frontend only for now)
  const performDelete = async (id) => {
    try {
      const token = await getToken();

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // after successful delete, update UI
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product deleted successfully",
      });
    } catch (err) {
      console.log("Delete product error:", err?.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete product",
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* HEADER */}
      <View className="p-4 bg-white border border-gray-100 flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-primary">
          Total Products ({products.length})
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/admin/products/add")}
          className="bg-gray-800 px-4 py-2 rounded-full flex-row items-center">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-medium ml-1">Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView
        className="flex-1 p-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {products.length === 0 ?
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-secondary">No products found</Text>
          </View>
        : products.map((product, index) => {
            const id = product._id || product.id || `fallback-${index}`;

            const image =
              product.images?.length > 0 ?
                product.images[0]
              : "https://via.placeholder.com/150";

            const sizeText =
              Array.isArray(product.sizes) ?
                product.sizes.join(", ")
              : product.sizes || "-";

            const priceText = Number(product.price || 0).toFixed(2);

            return (
              <View
                key={String(id)} // ✅ FIXED UNIQUE KEY
                className="bg-white p-3 rounded-lg border border-gray-100 mb-3 flex-row items-center">
                <Image
                  source={{ uri: image }}
                  className="w-16 h-16 rounded-lg bg-gray-100 mr-3"
                  resizeMode="cover"
                />

                <View className="flex-1">
                  <Text
                    className="font-bold text-primary text-base"
                    numberOfLines={1}>
                    {product.name}
                  </Text>

                  <Text className="text-secondary text-xs mb-1">
                    Category: {product.category || "Others"}
                  </Text>

                  <Text className="text-secondary text-xs mb-1">
                    Stock: {product.stock ?? 0}
                  </Text>

                  <Text className="text-secondary text-xs mb-1">
                    Sizes: {sizeText}
                  </Text>

                  <Text className="text-primary font-bold">${priceText}</Text>
                </View>

                {/* ACTIONS */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => router.push(`/admin/products/edit/${id}`)}
                    className="p-2 bg-slate-50 rounded-full mr-2">
                    <Ionicons name="create-outline" size={18} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => performDelete(id)}
                    className="p-2 bg-gray-50 rounded-full">
                    <Ionicons name="trash-outline" size={18} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        }
      </ScrollView>
    </View>
  );
}
