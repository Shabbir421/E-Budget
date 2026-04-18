/** @format */

import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES } from "@/assets/constants";
import CategoryItem from "@/components/CategoryItem";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "@/components/ProductCard";

const { width, height } = Dimensions.get("window");
export default function Home() {
  const router = useRouter();
  const [activeBannerindex, setActiveBannerIndex] = useState(0);
  const categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setProducts(dummyProducts as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header  title="Forever" showCart showMenu showLogo  />
      <ScrollView
        className="flex-1 px-4 bg-surface"
        showsHorizontalScrollIndicator={false}>
        {/* Banner slider */}

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
            {BANNERS.map((banner, index) => (
              <View
                key={index}
                style={{ width: width - 32 }}
                className="w-full h-full">
                <Image
                  source={{ uri: banner.image }}
                  className="w-full h-full  rounded-xl"
                  resizeMode="cover"
                />
                <View className="absolute bottom-4 left-4 z-10">
                  <Text className="text-white text-2xl font-bold">
                    {banner.title}
                  </Text>
                  <Text className=" font-medium text-white text-sm ">
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
          {/* paggination dots */}
          <View className="flex-row justify-center mt-3 gap-2">
            {BANNERS.map((_, index) => (
              <View
                key={index}
                className={` h-2 rounded-full ${
                  index === activeBannerindex ? "w-6 bg-black" : (
                    "w-2 bg-gray-300"
                  )
                }`}
              />
            ))}
          </View>
        </View>
        {/* categories */}
        <View className="mb-6">
          <Text className="text-primary text-xl font-bold -mt-6 ">
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full h-32 mt-2">
            {categories.map((cat: any, index) => (
              <CategoryItem
                key={index}
                item={cat}
                isSelected={cat.id === "all"}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: cat.id === "all" ? "" : cat.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* popular products */}
        <View className="mb-6">
          {/* Header */}
          <View className="flex-row justify-between items-center -mt-6 mb-2">
            <Text className="text-primary text-xl font-bold">
              Popular Products
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/product/shop")}>
              <Text className="text-sm text-primary font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <View className="flex-row flex-wrap justify-between">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onPress={() =>
                  router.push({
                    pathname: "/product-details",
                    params: { id: product.id },
                  })
                }
              />
            ))}
          </View>
        </View>
        {/* Newsletter Section */}
        <View className="bg-primary rounded-xl -mt-6 p-5 mb-8">
          {/* Heading */}
          <Text className="text-black text-xl font-bold text-center">
            Join the Revolution
          </Text>

          {/* Description */}
          <Text className="text-black text-sm text-center mt-2 opacity-90">
            Subscribe to get exclusive deals, latest products, and updates
            directly to your inbox.
          </Text>

          {/* Button */}
          <View className="mt-4 pb-12">
            {/* Subscribe Button */}
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
