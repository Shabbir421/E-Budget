/** @format */

import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

export default function MyReview() {
  const router = useRouter();

  // dummy reviews (replace with API later)
  const reviews = [
    {
      id: "1",
      productName: "Nike Air Max Shoes",
      image: "https://i.imgur.com/1bX5QH6.jpg",
      rating: 4,
      comment: "Great quality and very comfortable!",
    },
    {
      id: "2",
      productName: "Apple Watch Series 9",
      image: "https://i.imgur.com/2nCt3Sbl.jpg",
      rating: 5,
      comment: "Excellent product, worth the price.",
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row mt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            size={16}
            color="#facc15"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
   <Header  title="Reviews"  showBack  />
      {/* LIST */}
      {reviews.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="star-outline" size={60} color="#ccc" />
          <Text className="text-gray-500 mt-2">No reviews yet</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">

              {/* PRODUCT */}
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-lg"
                />

                <View className="ml-3 flex-1">
                  <Text className="font-semibold" numberOfLines={1}>
                    {item.productName}
                  </Text>

                  {/* STARS */}
                  {renderStars(item.rating)}
                </View>
              </View>

              {/* COMMENT */}
              <Text className="text-gray-600 mt-3">
                {item.comment}
              </Text>

              {/* ACTIONS */}
              <View className="flex-row justify-end mt-3">
                <TouchableOpacity className="mr-4">
                  <Ionicons name="pencil-outline" size={20} color="black" />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>

            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}