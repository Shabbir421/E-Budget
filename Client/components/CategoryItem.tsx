/** @format */

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CategoryItemProps } from "@/assets/constants/types";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryItem({
  item,
  isSelected,
  onPress,
}: CategoryItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center mr-2"
      activeOpacity={0.7}
    >
      <View
        className={`w-14 h-14 rounded-full items-center justify-center mb-1 ${
          isSelected ? "bg-black" : "bg-gray-200"
        }`}
      >
        <Ionicons
          name={item.icon as any}
          size={24}
          color={isSelected ? "#fff" : "#000"}
        />
      </View>

      <Text
        className={`text-xs ${
          isSelected ? "text-black font-semibold" : "text-gray-500"
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}