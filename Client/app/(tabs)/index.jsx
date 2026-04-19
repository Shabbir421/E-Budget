/** @format */

import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { BANNERS } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES } from "@/assets/constants";
import CategoryItem from "@/components/CategoryItem";
import ProductCard from "@/components/ProductCard";
import { api } from "@/constants/api";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  const [activeBannerindex, setActiveBannerIndex] = useState(0);

  const categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const data = res.data?.products || res.data;

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Product Fetch Error:", err?.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Forever" showCart showMenu showLogo />

      <ScrollView
        className="flex-1 px-4 bg-surface"
        showsVerticalScrollIndicator={false}>
        {/* ================= BANNER ================= */}
        <View className="mb-6">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full h-48 rounded-xl"
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              if (slide !== activeBannerindex) {
                setActiveBannerIndex(slide);
              }
            }}>
            {BANNERS.map((banner) => (
              <View
                key={banner.id || banner.title}
                style={{ width: width - 32 }}
                className="w-full h-full">
                <Image
                  source={{ uri: banner.image }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />

                <View className="absolute bottom-4 left-4 z-10">
                  <Text className="text-white text-2xl font-bold">
                    {banner.title}
                  </Text>

                  <Text className="font-medium text-white text-sm">
                    {banner.subtitle}
                  </Text>

                  <TouchableOpacity className="mt-2 bg-white py-2 px-4 rounded-full self-start">
                    <Text className="text-primary text-xs font-bold">
                      Shop Now
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="absolute inset-0 bg-black/40" />
              </View>
            ))}
          </ScrollView>

          {/* DOTS */}
          <View className="flex-row justify-center mt-3 gap-2">
            {BANNERS.map((banner) => (
              <View
                key={banner.id || banner.title + "-dot"}
                className={`h-2 rounded-full ${
                  activeBannerindex === BANNERS.indexOf(banner) ?
                    "w-6 bg-black"
                  : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        {/* ================= CATEGORIES ================= */}
        <View className="mb-6">
          <Text className="text-primary text-xl font-bold -mt-6">
            Categories
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2">
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={cat.id === "all"}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: {
                      category: cat.id === "all" ? "" : cat.name,
                    },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* ================= PRODUCTS ================= */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center -mt-6 mb-2">
            <Text className="text-primary text-xl font-bold">
              Popular Products
            </Text>

            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text className="text-sm text-primary font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {Array.isArray(products) &&
              products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() =>
                    router.push({
                      pathname: "/product-details",
                      params: { id: product._id },
                    })
                  }
                />
              ))}
          </View>
        </View>

        {/* ================= NEWSLETTER ================= */}
        <View className="bg-primary rounded-xl -mt-6 p-5 mb-8">
          <Text className="text-black text-xl font-bold text-center">
            Join the Revolution
          </Text>

          <Text className="text-black text-sm text-center mt-2 opacity-90">
            Subscribe to get exclusive deals, latest products, and updates.
          </Text>

          <View className="mt-4 pb-12">
            <TouchableOpacity className="bg-black mt-3 py-3 rounded-full">
              <Text className="text-white text-center font-semibold">
                Subscribe
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
