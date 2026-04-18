/** @format */

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlist } from "@/context/WishlistContext"; // ✅ ADDED

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ✅ WISHLIST CONTEXT ADDED
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // ✅ Safe Back Function
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // ✅ Fetch product
  useEffect(() => {
    const foundProduct = dummyProducts.find(
      (item) => item._id === id || item.id === id,
    );

    setProduct(foundProduct || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <Text className="text-center mt-10">Loading...</Text>;
  }

  if (!product) {
    return <Text className="text-center mt-10">Product Not Found</Text>;
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-1 bg-white">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 🖼 IMAGE SECTION */}
          <View className="relative">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const slide = Math.round(
                  e.nativeEvent.contentOffset.x /
                    e.nativeEvent.layoutMeasurement.width,
                );
                setActiveImageIndex(slide);
              }}>
              {product.images.map((img: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={{ width: width, height: 450 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* 🔙 ICONS */}
            <View className="absolute top-3 left-4 right-4 flex-row justify-between items-center z-10">
              <TouchableOpacity
                onPress={handleBack}
                className="w-10 h-10 rounded-full bg-white/80 justify-center items-center">
                <Ionicons name="arrow-back" size={20} color="black" />
              </TouchableOpacity>

              {/* ❤️ WISHLIST FIX */}
              <TouchableOpacity
                onPress={() => toggleWishlist(product)}
                className="w-10 h-10 rounded-full bg-white/80 justify-center items-center">
                <Ionicons
                  name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                  size={20}
                  color={isInWishlist(product._id) ? "red" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 🔘 DOTS */}
          <View className="flex-row justify-center mt-2">
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 mx-1 rounded-full ${
                  activeImageIndex === index ? "w-4 bg-black" : (
                    "w-2 bg-gray-300"
                  )
                }`}
              />
            ))}
          </View>

          {/* 📦 PRODUCT INFO */}
          <View className="px-4 mt-4">
            {/* NAME + RATING */}
            <View className="flex-row justify-between items-center">
              <Text
                className="text-2xl font-bold flex-1 pr-2"
                numberOfLines={2}>
                {product.name}
              </Text>

              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#facc15" />

                <Text className="font-bold ml-1 text-gray-800">
                  {product.rating ?? 4.5}
                </Text>

                <Text className="ml-1  text-gray-700 text-sm">
                  {`(${Number(product.reviewsCount ?? 120).toFixed(0)})`}{" "}
                </Text>
              </View>
            </View>

            {/* PRICE */}
            <Text className="text-2xl font-bold text-primary mt-2">
              ₹{product.price}
            </Text>

            {/* SIZE */}
            {product.sizes && (
              <View className="mt-4">
                <Text className="font-bold text-lg mb-2">Size</Text>

                <View className="flex-row flex-wrap gap-2">
                  {product.sizes.map((size: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-full ${
                        selectedSize === size ?
                          "bg-black border-black"
                        : "border-gray-300"
                      }`}>
                      <Text
                        className={
                          selectedSize === size ? "text-white" : "text-black"
                        }>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* DESCRIPTION */}
            <Text className="text-gray-700 text-sm mt-4 mb-28 leading-5">
              {product.description ||
                "Premium quality product with modern design and comfort. Perfect for everyday use."}
            </Text>
          </View>
        </ScrollView>

        {/* 🛒 BOTTOM BAR */}
        <View className="flex-row items-center px-4 py-5 bg-white shadow-lg">
          <TouchableOpacity className="flex-1 bg-black py-3 rounded-full">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="bag-outline" size={18} color="white" />
              <Text className="text-white font-semibold text-base">
                Add to Cart
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="ml-4 bg-gray-100 p-4 rounded-full">
            <Ionicons name="cart-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
