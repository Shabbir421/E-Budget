/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { COLORS } from "@/constants";

export default function MyReview() {
  const { getToken } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReviews(data || []);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header title="Reviews" showBack />

      {reviews.length === 0 ?
        <View className="flex-1 items-center justify-center">
          <Ionicons name="star-outline" size={60} color="#ccc" />
          <Text className="text-gray-500 mt-2">No reviews yet</Text>
        </View>
      : <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">

              {/* PRODUCT */}
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.product?.image }}
                  className="w-16 h-16 rounded-lg"
                />

                <View className="ml-3 flex-1">
                  <Text className="font-semibold" numberOfLines={1}>
                    {item.product?.name}
                  </Text>

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
      }
    </SafeAreaView>
  );
}